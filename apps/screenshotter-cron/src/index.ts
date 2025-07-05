/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	//
	// Example binding to a D1 Database. Learn more at https://developers.cloudflare.com/workers/platform/bindings/#d1-database-bindings
	// DB: D1Database
	WARMUP_URL?: string;
	WARMUP_INTERVAL_MINUTES?: string; // Default: 5 minutes
	SCREENSHOTTER_URL: string;
	SCREENSHOTTER_ACCESS_TOKEN: string;
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
		function wait(seconds: number) {
			return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
		}

		function triggerScreenshotter() {
			fetch(env.SCREENSHOTTER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					accessToken: env.SCREENSHOTTER_ACCESS_TOKEN
				})
			});
		}

		async function triggerWarmup() {
			if (!env.WARMUP_URL) return;

			try {
				await fetch(env.WARMUP_URL, {
					method: 'GET',
					headers: {
						'User-Agent': 'Cloudflare-Worker-Warmup'
					}
				});
				console.log('Warmup request sent successfully');
			} catch (error) {
				console.error('Warmup request failed:', error);
			}
		}

		function shouldTriggerWarmup(): boolean {
			if (!env.WARMUP_URL) return false;

			const intervalMinutes = parseInt(env.WARMUP_INTERVAL_MINUTES || '4');
			const currentMinute = new Date().getMinutes();

			// Trigger warmup when current minute is divisible by interval
			return currentMinute % intervalMinutes === 0;
		}

		// Always trigger screenshotter (3 requests with 20s intervals)
		triggerScreenshotter();
		await wait(20);
		triggerScreenshotter();
		await wait(20);
		triggerScreenshotter();

		// Conditionally trigger warmup based on interval
		if (shouldTriggerWarmup()) {
			await triggerWarmup();
		}
	}
};
