export function generatePath(template: string, replacements: { [key: string]: string }) {
	Object.entries(replacements).forEach(([key, value]) => {
		template = template.replace(`${key}`, value);
	});
	template = template.replace(/\/+/g, '/');
	return template;
}
