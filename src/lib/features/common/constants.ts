import { dev } from '$app/environment';
import { PUBLIC_HOST, PUBLIC_PORT } from '$env/static/public';

export const HOST = dev ? `${PUBLIC_HOST}:${PUBLIC_PORT}` : `${PUBLIC_HOST}`;
