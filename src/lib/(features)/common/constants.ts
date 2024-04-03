import { dev } from '$app/environment';
import { PUBLIC_HOST, PUBLIC_PORT } from '$env/static/public';

export const BASE_URL = dev ? `http://${PUBLIC_HOST}:${PUBLIC_PORT}` : `https://${PUBLIC_HOST}`;
