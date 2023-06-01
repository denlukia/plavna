import { z } from 'zod';

export const SlugValidator = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g);
