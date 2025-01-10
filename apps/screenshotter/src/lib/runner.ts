import { TIMEOUT_FOR_PROCESSING_BEFORE_REPORT } from './constants';

export function createRunner() {
	let label = `Run ${Math.floor(Math.random() * 1000)}`;
	let timedOut = false;
	const timer = setTimeout(() => {
		timedOut = true;
	}, TIMEOUT_FOR_PROCESSING_BEFORE_REPORT);

	// Will perform next task only if we're not timed out
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async function run<F extends (...args: any[]) => any>(
		fn: F,
		...args: Parameters<F>
	): Promise<ReturnType<F>> {
		if (!timedOut) {
			let result = fn(...args);
			if (result instanceof Promise) {
				result = await result;
				console.log(`${label}: finished ${fn.name}`);
			}
			return result;
		} else {
			throw new Error('Timeout');
		}
	}

	return { run, timer };
}
