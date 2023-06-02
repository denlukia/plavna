import { z } from 'zod';

export const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g);
export const PageId = z.coerce.number();
