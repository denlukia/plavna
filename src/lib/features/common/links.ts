export function generatePath(
	template: string,
	replacements: { [key: string]: string | undefined }
) {
	Object.entries(replacements).forEach(([key, value]) => {
		template = template.replace(`${key}`, value || '');
	});
	template = template.replace(/\/+/g, '/');
	return template;
}
