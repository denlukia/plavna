export const EN = {
	layout: {
		language: 'Language',
		my_pages: 'My pages',
		my: 'My',
		no_translation: 'No translation',
		or: 'or'
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
	pages_list: {
		create: 'Create',
		update: 'Update',
		slug: 'Slug',
		username: 'Username',
		user_id: 'User ID',
		main_page: 'Default',
		delete_page: 'Delete',
		edit_page: 'Edit',
		create_new_page: 'Create',

		errors: {
			disallowed_chars: 'Only small latin letters, numbers and "-" are allowed',
			max_length: 'Max length is 15 symbols',
			slug_in_use: 'You already have a page with this slug',
			only_one_default_slug: 'Only one default page can exist'
		}
	},
	page_actor: {
		section: {
			editor_title: 'Section',
			create: 'Create',
			update: 'Update',
			edit: 'Edit',
			delete: 'Delete',
			cancel: 'Cancel',
			description: 'Description',
			available_tags: 'Available tags',
			gotta_create_tags:
				'Create at least one tag during article creation to reference it in section',
			tag_name: 'Tag name',
			no_articles: 'You have not labeled any articles with selected tags',
			section_invisible:
				"In current language this section is only visible to you,<br> because it doesn't have description translation"
		}
	},
	page: {
		section: {
			no_articles: 'Author has not labeled any articles with selected tags'
		}
	},
	article_editor: {
		tags: {
			list_label: "Article's tags",
			editing_form_title: 'Tag',
			name_label: 'Name',
			edit_name_label: 'Edit name',
			delete: 'Delete',
			new_tag: 'New Tag',
			create: 'Create'
		},
		actions: {
			publish: 'Publish',
			hide: 'Hide',
			delete: 'Delete',
			view: 'View'
		},
		previews: {
			add: 'Add Custom Preview',
			new_form_title: 'New Custom Preview',
			editing_form_title: 'Custom Preview Editing',
			create: 'Create',
			update: 'Update',
			delete: 'Delete',
			url: 'Address',
			url_placeholder: 'https://example.com',
			name: 'Name',
			image: 'Image'
		},
		heading: 'Article Editing',
		title: 'Title',
		short_description: 'Short description',
		slug: 'Slug',
		preview_plavna_modern: 'Plavna Modern',
		preview_custom: 'Custom Preview'
	}
};

// All new translations must have type equality assertion with EN translation
// Copy them from uk.ts upon creating new translation
