const translations = {
	signup: 'Sign up',
	login: 'Login',
	to_signup: 'Sign up',
	to_login: 'Login',
	language: 'Language',
	username: 'Username',
	password: 'Password',
	landing: 'Landing',
	user_id: 'User ID',
	to_sign_out: 'Sign out',
	couldnt_create_page: "Could not create a page and I don't know why",
	invalid_slug: 'Invalid slug',
	slug_in_use: 'Slug in use',
	only_one_default_slug: 'Only one default slug is allowed',
	delete_page: 'Delete page',
	couldnt_delete_page: "Could not delete a page and I don't know why"
};

export type FullTranslation = Record<keyof typeof translations, any>;
// Import this type from here to any next translations
// to check presence of all the keys present here

export type PossibleTransKey = keyof typeof translations;

export default translations;
