export function detectConstraintError(error: Error) {
	if (!error.cause || typeof error.cause !== 'object') return false;
	if (
		'message' in error.cause &&
		typeof error.cause.message === 'string' &&
		error.cause.message.includes('UNIQUE constraint failed')
	)
		return true;
}
