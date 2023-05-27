const translations = {
	to_signup: 'Sign up'
};

export type RequiredKeys = Record<keyof typeof translations, any>;
// Import this type from here to any next translations
// to check presence of all the keys present here

export default translations;
