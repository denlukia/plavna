export type UnionIncludesAll<T, U> = Exclude<U, T> extends never ? true : false;

export type RemoveNullValues<T> = {
	[K in keyof T as Exclude<T[K], null> extends never ? never : K]: T[K];
};

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
	  }
	: T;
