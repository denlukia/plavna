import type { imageMock, ImageProviderRelatedActorData } from '@plavna/common';
import type { getImageTypeAndSize } from '$lib/probe-image-size';

export type ImageSource = 'imagekit';

type SupportedLang = string | null;
type ImageId = typeof imageMock.$inferSelect.id;

export type ImgValidationConfig = {
	formats: string[];
	maxSizeMb: number;
};

export type ImageUploadConfig = {
	imageId: ImageId;
	lang: SupportedLang;
};

export type UploadResult = {
	path: string;
};

export type ImagePathUpdateOrDeletion = {
	record:
		| {
				id: ImageId;
				source: ImageSource;
				path: string;
				width: number;
				height: number;
				background: string | null;
		  }
		| { id: ImageId };
	lang: SupportedLang | null;
};

export type BaseUploadOptions = {
	fileName: string;
	folder: string;
};

export type Base64String = string;

export type ClientUploadCredentials = {
	signature: string;
	token: string;
	expire: number;
};

export type Provider = {
	type: ImageSource;
	data: ImageProviderRelatedActorData;
};

export type SizeAndType = NonNullable<ReturnType<typeof getImageTypeAndSize>>;

export type Uploader = (options: BaseUploadOptions) => Promise<UploadResult>;

export interface NdArray<D extends Data = Data<number>> {
	data: D;
	shape: number[];
	stride: number[];
	offset: number;
	dtype: DataType<D>;
	size: number;
	order: number[];
	dimension: number;
	get(...args: number[]): Value<D>;
	set(...args: number[]): Value<D>;
	index(...args: number[]): Value<D>;
	lo(...args: number[]): NdArray<D>;
	hi(...args: number[]): NdArray<D>;
	step(...args: number[]): NdArray<D>;
	transpose(...args: number[]): NdArray<D>;
	pick(...args: Array<number | null>): NdArray<D>;
	T: NdArray<D>;
}

interface GenericArray<T> {
	get(idx: number): T;
	set(idx: number, value: T): void;
	length: number;
}

type MaybeBigInt64Array = InstanceType<
	typeof globalThis extends { BigInt64Array: infer T } ? T : never
>;
type MaybeBigUint64Array = InstanceType<
	typeof globalThis extends { BigUint64Array: infer T } ? T : never
>;

type Data<T = any> = T extends number
	? GenericArray<T> | T[] | TypedArray
	: T extends bigint
		? GenericArray<T> | T[] | MaybeBigInt64Array | MaybeBigUint64Array
		: GenericArray<T> | T[];

type TypedArray =
	| Int8Array
	| Int16Array
	| Int32Array
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array
	| Float32Array
	| Float64Array;

type Value<D extends Data> = D extends GenericArray<infer T> | Record<number, infer T> ? T : never;

type DataType<D extends Data = Data> = D extends Int8Array
	? 'int8'
	: D extends Int16Array
		? 'int16'
		: D extends Int32Array
			? 'int32'
			: D extends Uint8Array
				? 'uint8'
				: D extends Uint8ClampedArray
					? 'uint8_clamped'
					: D extends Uint16Array
						? 'uint16'
						: D extends Uint32Array
							? 'uint32'
							: D extends Float32Array
								? 'float32'
								: D extends Float64Array
									? 'float64'
									: D extends MaybeBigInt64Array
										? 'bigint64'
										: D extends MaybeBigUint64Array
											? 'biguint64'
											: D extends GenericArray<unknown>
												? 'generic'
												: 'array';
