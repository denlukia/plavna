<script lang="ts">
	import { ARTISTIC_OVERFLOW } from '@plavna/common';
	import type { PreviewDataProp } from '@plavna/common';
	import { ImageCDN, Layers, PreviewFoundation } from '@plavna/design/components';
	import { Tween, tweened } from 'svelte/motion';
	import ImageWrapper from '$lib/preview/ImageWrapper.svelte';

	type Props = {
		data: PreviewDataProp;
	};

	let { data }: Props = $props();

	let {
		title_translation,
		description_translation,
		publish_time,
		cols,
		rows,
		tags,
		prop_1: videosFolder,
		translation_1,
		translation_2,
		img_1,
		img_2,
		likes_count,
		viewing_in_article
	} = $derived(data);

	let videoEl: HTMLVideoElement | null = $state(null);
	let videoCurrentTime = $state(0);

	function getImage() {
		if (viewing_in_article) return img_2 || img_1;
		return img_1;
	}

	function getVideosFromFolder() {
		if (!videosFolder) return null;
		const noTrailingSlash =
			videosFolder.slice(-1) === '/' ? videosFolder.slice(0, -1) : videosFolder;
		const subfolder = viewing_in_article ? 'in-article' : 'in-grid';
		return {
			vp9: `${noTrailingSlash}/${subfolder}/preview.webm?requestedAt=${Date.now()}`,
			hevc: `${noTrailingSlash}/${subfolder}/preview.mov?requestedAt=${Date.now()}`
		};
	}

	// State tracking variables
	let isPlayingToMiddle = false;
	let isPlayingToEnd = false;
	let shouldPlayToEndThenMiddle = false;
	let middleReachedListener: ((event: Event) => void) | null = null;
	let endReachedListener: ((event: Event) => void) | null = null;

	function onpointerenter() {
		if (!videoEl) return;

		// console.log('onpointerenter - states:', {
		// 	isPlayingToMiddle,
		// 	isPlayingToEnd,
		// 	shouldPlayToEndThenMiddle
		// });

		const middle = videoEl.duration / 2;

		if (isPlayingToEnd) {
			// If currently playing to end, set flag to play from 0 to middle after end
			// DON'T clear listeners here - let the end listener finish its job
			shouldPlayToEndThenMiddle = true;
			// console.log('Setting shouldPlayToEndThenMiddle = true, keeping end listener active');
			return;
		}

		// Clear any existing listeners only if we're not playing to end
		clearListeners();

		// Reset state and start playing from beginning to middle
		isPlayingToMiddle = true;
		isPlayingToEnd = false;
		shouldPlayToEndThenMiddle = false;
		videoEl.currentTime = 0;

		// console.log('Starting play to middle, currentTime reset to 0');

		// Ensure video plays
		const playPromise = videoEl.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					// console.log('Video started playing successfully');
				})
				.catch((error) => {
					console.error('Error playing video:', error);
				});
		}

		// Set up listener for when middle is reached
		middleReachedListener = function () {
			if (!videoEl) return;
			if (videoEl.currentTime >= middle) {
				// console.log('Middle reached, pausing at:', videoEl.currentTime);
				videoEl.pause();
				isPlayingToMiddle = false;
				if (middleReachedListener) {
					videoEl.removeEventListener('timeupdate', middleReachedListener);
					middleReachedListener = null;
				}
			}
		};

		videoEl.addEventListener('timeupdate', middleReachedListener);
	}

	function onpointerleave() {
		if (!videoEl) return;

		// console.log('onpointerleave - states:', {
		// 	isPlayingToMiddle,
		// 	isPlayingToEnd,
		// 	shouldPlayToEndThenMiddle
		// });

		const middle = videoEl.duration / 2;

		// Clear any existing listeners
		clearListeners();

		if (isPlayingToMiddle) {
			// If currently playing to middle, continue to middle then play to end
			isPlayingToMiddle = false;

			if (videoEl.currentTime < middle) {
				// console.log("Haven't reached middle yet, continuing to middle first");
				// Haven't reached middle yet, play to middle first
				middleReachedListener = function () {
					if (!videoEl) return;
					if (videoEl.currentTime >= middle) {
						// console.log('Middle reached during leave, now playing to end');
						if (middleReachedListener) {
							videoEl.removeEventListener('timeupdate', middleReachedListener);
							middleReachedListener = null;
						}
						playToEnd();
					}
				};
				videoEl.addEventListener('timeupdate', middleReachedListener);
			} else {
				// console.log('Already at or past middle, playing to end');
				// Already at or past middle, play to end
				playToEnd();
			}
		} else if (!isPlayingToEnd) {
			// console.log('Not currently playing, starting play to end');
			// If not currently playing anything, play to end from current position
			playToEnd();
		}
	}

	function playToEnd() {
		if (!videoEl) return;

		// console.log('playToEnd called, currentTime:', videoEl.currentTime);

		isPlayingToEnd = true;
		isPlayingToMiddle = false;

		// Ensure video plays
		const playPromise = videoEl.play();
		if (playPromise !== undefined) {
			playPromise
				.then(() => {
					// console.log('Video playing to end successfully');
				})
				.catch((error) => {
					console.error('Error playing video to end:', error);
				});
		}

		endReachedListener = function () {
			if (!videoEl) return;
			if (videoEl.currentTime >= videoEl.duration - 0.1) {
				// Small buffer for end detection
				// console.log('End reached, pausing at:', videoEl.currentTime);
				videoEl.pause();
				isPlayingToEnd = false;
				if (endReachedListener) {
					videoEl.removeEventListener('timeupdate', endReachedListener);
					endReachedListener = null;
				}

				// Check if we need to play from 0 to middle after reaching end
				if (shouldPlayToEndThenMiddle) {
					// console.log('Should play to end then middle, calling onpointerenter');
					shouldPlayToEndThenMiddle = false;
					setTimeout(() => {
						if (!isPlayingToMiddle && !isPlayingToEnd) {
							onpointerenter();
						}
					}, 50); // Small delay to ensure clean state transition
				}
			}
		};

		videoEl.addEventListener('timeupdate', endReachedListener);
	}

	function clearListeners() {
		if (middleReachedListener && videoEl) {
			videoEl.removeEventListener('timeupdate', middleReachedListener);
			middleReachedListener = null;
		}
		if (endReachedListener && videoEl) {
			videoEl.removeEventListener('timeupdate', endReachedListener);
			endReachedListener = null;
		}
	}

	// Usage example:
	// videoEl.addEventListener('pointerenter', onpointerenter);
	// videoEl.addEventListener('pointerleave', onpointerleave);
</script>

<PreviewFoundation artisticOverflow={ARTISTIC_OVERFLOW}>
	{#snippet overflowing()}
		<div class="preview" {onpointerenter} {onpointerleave}>
			<Layers>
				{@const image = getImage()}
				{#if image && videoCurrentTime === 0}
					<ImageWrapper inArticle={viewing_in_article}>
						<ImageCDN
							objectFit="stretch"
							pathAndMeta={image}
							bgInset="{ARTISTIC_OVERFLOW}px"
							fitAndCoverParent
						/>
					</ImageWrapper>
				{/if}
				{@const videos = getVideosFromFolder()}
				{#if videos}
					<video class="video" muted bind:this={videoEl} bind:currentTime={videoCurrentTime}>
						<source src={videos.hevc} type="video/quicktime; codecs=hvc1" />
						<source src={videos.vp9} type="video/webm; codecs=vp9" />
					</video>
				{/if}
			</Layers>
		</div>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		height: 100%;
		pointer-events: all;
	}
	.video {
		object-fit: contain;
		height: 100%;
		width: 100%;
	}
</style>
