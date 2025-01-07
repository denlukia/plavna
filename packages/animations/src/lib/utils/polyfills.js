export function applyPointerCapturePolyfill() {
	if (
		navigator.userAgent.match(/Version\/1[3456]\.\d+(?:\.\d+)?.* Safari/) &&
		!window.pointerCapturePolyfillApplied
	) {
		const {
			setPointerCapture: set,
			hasPointerCapture: has,
			releasePointerCapture: release
		} = Element.prototype;

		let targets = {},
			captures = {};

		Element.prototype.setPointerCapture = function setPointerCapture(pointerId) {
			if (pointerId in captures) {
				if (document.contains(this)) {
					captures[pointerId] = this;
					return set.call(targets[pointerId], pointerId);
				} else {
					throw new TypeError('Element not in valid location');
				}
			} else {
				return set.call(this, pointerId);
			}
		};
		Element.prototype.hasPointerCapture = function hasPointerCapture(pointerId) {
			if (pointerId in captures) {
				return captures[pointerId] == this;
			} else {
				return has.call(this, pointerId);
			}
		};
		Element.prototype.releasePointerCapture = function releasePointerCapture(pointerId) {
			if (pointerId in captures) {
				if (this.hasPointerCapture(pointerId)) {
					captures[pointerId] = null;
					return release.call(targets[pointerId], pointerId);
				}
			} else {
				return release.call(this, pointerId);
			}
		};

		let registerPointer = function registerPointer(event) {
				if (event.pointerType == 'touch' || event.pointerType == 'pen') {
					targets[event.pointerId] = event.target;
					captures[event.pointerId] = null;
				}
			},
			redirectPointer = function redirectPointer(event) {
				if (captures[event.pointerId] != null && captures[event.pointerId] != event.target) {
					// Stop the original event
					event.preventDefault();
					event.stopPropagation();

					// Redispatch a new, cloned event
					captures[event.pointerId].dispatchEvent(new PointerEvent(event.type, event));
				}
			},
			redirectAndUnregisterPointer = function redirectAndUnregisterPointer(event) {
				redirectPointer(event);
				delete targets[event.pointerId];
				delete captures[event.pointerId];
			};

		addEventListener('pointerdown', registerPointer, { capture: true, passive: true });
		addEventListener('pointermove', redirectPointer, { capture: true, passive: false });
		addEventListener('pointerup', redirectAndUnregisterPointer, { capture: true, passive: false });
		addEventListener('pointercancel', redirectAndUnregisterPointer, {
			capture: true,
			passive: false
		});
		window.pointerCapturePolyfillApplied = true;
	}
}
