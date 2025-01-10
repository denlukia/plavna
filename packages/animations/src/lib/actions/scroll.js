import { tick } from 'svelte';
import { clamp, map, getScrollContainer } from '../helpers/actionHelpers';

export async function scroll(
	node,
	{
		progress,
		axis = 'y',
		containerZeroPoint = 1,
		containerOnePoint = 0,
		containerZeroShift = 0,
		containerOneShift = 0,
		zeroPoint = 0,
		onePoint = 1,
		scrollContainer = null
	}
) {
	let scrollFor0, scrollFor1;

	async function init() {
		await tick();
		scrollContainer === null && (scrollContainer = getScrollContainer(node, axis));
		if (scrollContainer === null) return;
		scrollContainer.addEventListener('scroll', scroll);
		if (getComputedStyle(scrollContainer, null).getPropertyValue('position') === 'static') {
			scrollContainer.style.position = 'relative';
		}
		calculateScrollPoints();
	}

	// Should be called on resize
	function calculateScrollPoints() {
		scrollFor0 =
			node.offsetTop +
			node.clientHeight * zeroPoint -
			scrollContainer.clientHeight * containerZeroPoint +
			containerZeroShift;
		scrollFor1 =
			node.offsetTop +
			node.clientHeight * onePoint -
			scrollContainer.clientHeight * containerOnePoint +
			containerOneShift;
	}

	function scroll() {
		let scroll = axis === 'y' ? scrollContainer.scrollTop : scrollContainer.scrollLeft;
		let newProgress = map(scroll, scrollFor0, scrollFor1, 0, 1);
		let newProgressClamped = clamp(newProgress, 0, 1);
		progress.set(newProgressClamped);
	}

	if (progress) init();
	return {
		destroy() {
			scrollContainer.removeEventListener('scroll', scroll);
		},
		update({ progress }) {
			this.destroy();
			if (progress) init();
		}
	};
}
