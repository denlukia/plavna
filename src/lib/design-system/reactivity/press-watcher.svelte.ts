export function createPressWatcher(releaseTime: number = 150) {
	let releaseTiemout: ReturnType<typeof setTimeout> | null = null;
	let truePressed: boolean = $state(false);
	let clickPressed: boolean = $state(false);

	const pressed = $derived(truePressed || clickPressed);

	return {
		get pressed() {
			return pressed;
		},
		onclick() {
			clickPressed = true;

			if (releaseTiemout) {
				clearTimeout(releaseTiemout);
			}
			releaseTiemout = setTimeout(() => {
				clickPressed = false;
			}, releaseTime);
		},

		onpointerdown() {
			truePressed = true;
		},

		onpointerup() {
			truePressed = false;
		}

		// TODO Improve pressedness cancelation on mouse leave (onmouseleave/out/cancel are not working)
	};
}

// export class PressWatcher {
// 	private releaseTime: number;
// 	private releaseTiemout: ReturnType<typeof setTimeout> | null = null;
// 	truePressed: boolean = $state(false);
// 	clickPressed: boolean = $state(false);

// 	// pressed = $derived(this.truePressed || this.clickPressed);
// 	// pressed = $state(false);

// 	constructor(releaseTime: number = 250) {
// 		this.releaseTime = releaseTime;
// 	}

// 	onclick() {
// 		this.clickPressed = true;

// 		if (this.releaseTiemout) {
// 			clearTimeout(this.releaseTiemout);
// 		}
// 		this.releaseTiemout = setTimeout(() => {
// 			this.clickPressed = false;
// 		}, this.releaseTime);
// 	}

// 	onpointerdown() {
// 		this.truePressed = true;
// 	}

// 	onpointerup() {
// 		this.truePressed = false;
// 	}
// }
