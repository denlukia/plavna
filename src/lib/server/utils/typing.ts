export type UnionIncludesAll<T, U> = Exclude<U, T> extends never ? true : false;

export type RemoveNullValues<T> = {
	[K in keyof T as Exclude<T[K], null> extends never ? never : K]: T[K];
};
