import type { HTMLInputAttributes } from 'svelte/elements';

import type { TextSizes } from '../Typography';

export type SwitchProps = HTMLInputAttributes & {
	checked?: boolean;
	customSize?: TextSizes;
};
