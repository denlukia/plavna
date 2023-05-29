const translations = {
	signup: 'Sign up',
	login: 'Login',
	to_signup: 'Sign up',
	to_login: 'Login',
	language: 'Language',
	username: 'Username',
	password: 'Password',
	profile: 'Profile',
	user_id: 'User ID',
	to_sign_out: 'Sign out'
};

export type FullTranslation = Record<keyof typeof translations, any>;
// Import this type from here to any next translations
// to check presence of all the keys present here

export type PossibleTransKey = keyof typeof translations;

export default translations;
