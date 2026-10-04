<script module lang="ts">
	let counter = 0;

	// Geometry of static/ripple-rings.png, measured in pixels (275x276):
	// alpha ridges peak at r ~= 36 / 80 / 116 of half side 137.5.
	const PNG_OUTER_FRACTION = 0.84; // outer ridge radius as fraction of PNG half side
	const PNG_HOLE_FRACTION = 0.31; // inner ridge radius as fraction of outer ridge radius

	// Reveal (content) mask edge blur, px.
	const REVEAL_BLUR = 35;
	// Blur tail guard around the hole filter region.
	const BLUR_PAD = 120;

	// Both directions share one duration. Exported so hover owners can keep
	// the underlay mounted until the screenshot has closed back over it.
	export const RIPPLE_DURATION_MS = 675;
	// The iframe underneath fades 0 -> 1 over 750ms from ready. Punch the
	// hole only once it is (nearly) opaque, otherwise the hole shows the
	// half-transparent iframe mixed with white page behind it (gray veil).
	const ACTIVATION_DELAY = 700;
</script>

<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import { onMount, untrack } from 'svelte';

	type Origin = { x: number; y: number } | null;

	type Props = {
		/**
		 * Element the mask is applied to. Must fill the wrapper this component
		 * is rendered into, so mask and overlay share one coordinate system.
		 */
		target?: HTMLElement | null;
		/** When true, the dissolve runs to completion; otherwise it rests fully shown. */
		active?: boolean;
		/** Live pointer in target-local px. Snapshotted when an animation starts. Falls back to center. */
		origin?: Origin;
		/** Extra inset for the rings coverage on top of the bleed, per side. Default 0 */
		margin?: number;
		/** TODO LAB: temporary harness hook to freeze progress. Remove before merge. */
		frozen?: number | null;
	};

	let { target = null, active = false, origin = null, margin = 0, frozen = null }: Props = $props();

	// Mask id is assigned client-side only so SSR and hydration render identical markup.
	let uid: string | null = $state(null);
	let progress = $state(0);
	let box = $state({ w: 0, h: 0 });
	// The wrapper's --inset shifts it inside the bleed zone; the visible
	// preview area starts ARTISTIC_OVERFLOW minus that inset inside the box.
	let frameInset = $state(0);
	let loaded = $state(false);
	// Frozen at each animation start from the live pointer, so the epicenter
	// is where the mouse is when the animation plays (not where it entered,
	// which goes stale while content loads) and doesn't swim mid-animation.
	let epicenter = $state<Origin>(null);

	onMount(() => {
		counter += 1;
		uid = `ripple-mask-${counter}`;
	});

	$effect(() => {
		const element = target;
		if (!element) return;
		const measure = () => {
			box = { w: element.clientWidth, h: element.clientHeight };
			const host = element.parentElement;
			const raw = host ? getComputedStyle(host).getPropertyValue('--inset') : '';
			const px = parseFloat(raw);
			frameInset = Number.isFinite(px) ? px : 0;
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	});

	// Only play the dissolve once the wrapped content has actually loaded,
	// otherwise the animation runs over an empty (white) box.
	$effect(() => {
		const element = target;
		if (!element) {
			loaded = false;
			return;
		}
		loaded = false;
		let cancelled = false;
		const check = () => {
			const imgs = Array.from(element.querySelectorAll('img'));
			if (imgs.length === 0) {
				if (!cancelled) loaded = true;
				return true;
			}
			const done = imgs.every((img) => img.complete && img.naturalWidth > 0);
			if (done && !cancelled) loaded = true;
			return done;
		};
		if (check()) return;
		const observer = new MutationObserver(() => {
			if (check()) observer.disconnect();
		});
		observer.observe(element, { childList: true, subtree: true });
		const onCapture = () => {
			check();
		};
		element.addEventListener('load', onCapture, true);
		element.addEventListener('error', onCapture, true);
		return () => {
			cancelled = true;
			observer.disconnect();
			element.removeEventListener('load', onCapture, true);
			element.removeEventListener('error', onCapture, true);
		};
	});

	const measured = $derived(box.w > 0 && box.h > 0);

	// Don't touch mask-image until measured: a 0x0 mask would hide the element
	// for a frame (white blink).
	$effect(() => {
		const element = target;
		const id = uid;
		if (!element || !id || !measured) return;
		const value = `url(#${id})`;
		element.style.setProperty('mask-image', value);
		element.style.setProperty('-webkit-mask-image', value);
		element.style.setProperty('opacity', String(contentOpacity));
		return () => {
			element.style.removeProperty('mask-image');
			element.style.removeProperty('-webkit-mask-image');
			element.style.removeProperty('opacity');
		};
	});

	function easeInCubic(t: number) {
		return t * t * t;
	}

	function easeOutCubic(t: number) {
		return 1 - Math.pow(1 - t, 3);
	}

	$effect(() => {
		// TODO LAB: frozen harness state.
		if (frozen !== null) {
			progress = Math.min(1, Math.max(0, frozen));
			return;
		}
		const goal = active ? 1 : 0;
		const ready = loaded && uid !== null;
		const from = untrack(() => progress);
		if (!ready) return;
		if (from === goal) return;
		const forward = goal === 1;
		let raf = 0;
		let timer: ReturnType<typeof setTimeout> | null = null;
		const start = () => {
			// Snapshot the live pointer now: the animation is ready to play.
			epicenter = untrack(() => origin);
			const t0 = performance.now();
			const tick = (now: number) => {
				const t = Math.min(1, (now - t0) / RIPPLE_DURATION_MS);
				const eased = (forward ? easeOutCubic : easeInCubic)(t);
				progress = from + (goal - from) * eased;
				if (t < 1) raf = requestAnimationFrame(tick);
			};
			raf = requestAnimationFrame(tick);
		};
		// Dissolving forward punches a hole: wait until the content underneath
		// had a chance to turn opaque, otherwise the hole blinks white.
		if (forward) timer = setTimeout(start, ACTIVATION_DELAY);
		else start();
		return () => {
			if (timer) clearTimeout(timer);
			cancelAnimationFrame(raf);
		};
	});

	const cx = $derived(epicenter?.x ?? box.w / 2);
	const cy = $derived(epicenter?.y ?? box.h / 2);
	// Visible preview area: the wrapper bleeds ARTISTIC_OVERFLOW past the card,
	// shifted back by its own --inset. The rings live inside that rect so the
	// droplets never paint beyond the preview borders.
	const visInset = $derived.by(() => {
		const vis = ARTISTIC_OVERFLOW - frameInset;
		const maxInset = Math.min(box.w, box.h) / 2 - 1;
		return Math.min(Math.max(0, vis), Math.max(0, maxInset));
	});
	const rw = $derived(box.w - visInset * 2);
	const rh = $derived(box.h - visInset * 2);
	const rcx = $derived(cx - visInset);
	const rcy = $derived(cy - visInset);
	// Outer ridge grows until it covers the visible area.
	const coverRings = $derived.by(() => {
		const dx = Math.max(rcx - margin, rw - margin - rcx);
		const dy = Math.max(rcy - margin, rh - margin - rcy);
		return Math.hypot(Math.max(0, dx), Math.max(0, dy));
	});
	const outerR = $derived(coverRings * progress);
	// PNG is square; its outer ridge sits PNG_OUTER_FRACTION inside half side.
	// PNG is square; its outer ridge sits PNG_OUTER_FRACTION inside half side.
	const pngSide = $derived(outerR > 0 ? (outerR * 2) / PNG_OUTER_FRACTION : 0);
	const pngX = $derived(cx - pngSide / 2);
	const pngY = $derived(cy - pngSide / 2);
	// Hole locked to the inner ridge end to end: same progress, same curve
	// as the droplets, no separate window. Full clear comes from the content
	// fade below, on the same curve as the droplets fade.
	const holeR = $derived(PNG_HOLE_FRACTION * outerR);
	// Blur filter region follows the hole with room for the blur tails.
	const holeFx = $derived(cx - holeR - BLUR_PAD);
	const holeFy = $derived(cy - holeR - BLUR_PAD);
	const holeFw = $derived((holeR + BLUR_PAD) * 2);
	// Rings fade out at the very end of the animation (last 20-25%).
	const endT = $derived(Math.min(1, Math.max(0, (progress - 0.8) / 0.2)));
	const endSmooth = $derived(endT * endT * (3 - 2 * endT));
	const showOverlay = $derived(progress > 0.005 && progress < 0.999);
	// Droplets fade to 0 at both ends (first and last 20%), identically on
	// intro and outro, so they never pop in or out.
	const inT = $derived(Math.min(1, Math.max(0, progress / 0.2)));
	const inSmooth = $derived(inT * inT * (3 - 2 * inT));
	const overlayOpacity = $derived(inSmooth * (1 - endSmooth));
	// Content fades out on exactly the same curve as the droplets fade,
	// completing the dissolve once the locked hole stops short of the corners.
	const contentOpacity = $derived(1 - endSmooth);
</script>

<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="ripple-defs">
	<defs>
		<filter
			id={uid ? `${uid}-hole` : undefined}
			filterUnits="userSpaceOnUse"
			x={holeFx}
			y={holeFy}
			width={holeFw}
			height={holeFw}
		>
			<feGaussianBlur stdDeviation={REVEAL_BLUR} />
		</filter>
		{#if uid && measured}
			<mask id={uid} maskUnits="userSpaceOnUse" x="0" y="0" width={box.w} height={box.h}>
				<rect x="0" y="0" width={box.w} height={box.h} fill="white" />
				<circle {cx} {cy} r={holeR} fill="black" filter={`url(#${uid}-hole)`} />
			</mask>
		{/if}
	</defs>
</svg>

{#if uid && showOverlay && measured && rw > 0 && rh > 0 && pngSide > 0}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		class="ripple-overlay"
		viewBox="0 0 {box.w} {box.h}"
		style="opacity: {overlayOpacity}; mask-image: url(#{uid}); -webkit-mask-image: url(#{uid});"
	>
		<svg x={visInset} y={visInset} width={rw} height={rh} overflow="hidden" aria-hidden="true">
			<image
				href="/ripple-rings.png"
				x={pngX}
				y={pngY}
				width={pngSide}
				height={pngSide}
				preserveAspectRatio="xMidYMid meet"
			/>
		</svg>
	</svg>
{/if}

<style>
	.ripple-defs {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}
	/* Fills the wrapper (clipped by its overflow: hidden); the droplets are
	confined to the visible rect by the nested svg below. Shares the reveal
	mask, so droplets and screenshot fade on one soft curve. Above the masked
	content and, via z-index, above the revealed iframe underneath. */
	.ripple-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
		mix-blend-mode: overlay;
	}
</style>
