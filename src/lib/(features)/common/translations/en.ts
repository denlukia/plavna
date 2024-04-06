export const EN = {
	layout: {
		language: 'Language',
		my_pages: 'My Pages'
	},
	auth: {
		signup: 'Sign up',
		login: 'Login',
		email: 'Email',
		password: 'Password'
	},
	login: {
		to_login: 'Login',
		sign_in_with_github: 'Sign in with GitHub'
	},
	signup: {
		to_signup: 'Sign up'
	},
	main: {
		landing: 'Landing',
		to_sign_out: 'Sign out'
	},
	user_pages: {
		username: 'Username',
		user_id: 'User ID',
		main_page: 'Main',
		couldnt_create_page: "Could not create a page and I don't know why",
		invalid_slug: 'Invalid slug',
		slug_in_use: 'Slug in use',
		only_one_default_slug: 'Only one default slug is allowed',
		delete_page: 'Delete',
		couldnt_delete_page: "Could not delete a page and I don't know why",
		edit_page: 'Edit',
		couldnt_edit_page: "Could not edit a page slug and I don't know why",
		create_new_page: 'Create new page',
		couldnt_save_article: "Could not save a article and I don't know why",
		preview_custom: 'Custom Preview',

		errors: {
			only_one_default: 'Only one default page can exist',
			page_slug_exists: 'Page with this slug already exists',
			disallowed_chars: 'Only small latin letters, numbers and "-" are allowed',
			max_length: 'Max length is 15 symbols'
		}
	},
	article_editor: {
		preview_plavna_modern: 'Plavna Modern'
	}
};

// All new translations must have type equality assertion with EN translation
// Copy them from uk.ts upon creating new translation
