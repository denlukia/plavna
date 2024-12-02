// All new translations must have type equality assertion with EN translation
// Copy assertions from uk.ts upon creating new translation

export const EN = {
	layout: {
		language: 'Language',
		my_items: { pages: 'Pages', articles: 'Articles', settings: 'Settings' },
		my: 'My',
		no_translation: 'No translation',
		or: 'or',
		save: 'Save'
	},
	actor_errors: {
		disallowed_chars: 'Only small latin letters, numbers and "-" are allowed',
		min_length_3: 'Min length is 3 symbols',
		max_length_15: 'Max length is 15 symbols',
		reserved_word: "Shouldn't be a reserved word",
		reserved_prefix: "Shoudn't start with a reserved prefix",
		at_least_one_translation: 'At least one translation is required',
		slug_in_use: 'You already use this slug',
		only_one_default_slug: 'You already have one main page',
		unknown_error: 'Unknown error',
		cannot_delete: "Couldn't delete"
	},
	main: {
		landing: 'Landing',
		sign_in_with_github: 'Sign in with GitHub',
		to_sign_out: 'Sign out'
	},
	pages_list: {
		title: 'My Pages',
		create: 'Create',
		update: 'Update',
		slug: 'Slug',
		username: 'Username',
		user_id: 'User ID',
		main_page: 'Default',
		delete_page: 'Delete',
		edit_page: 'Edit',
		new: 'New'
	},
	articles_list: {
		title: 'My Articles',
		edit: 'Edit',
		delete: 'Delete',
		hide: 'Hide',
		publish: 'Publish'
	},
	page_actor: {
		section: {
			editor_title: 'Section',
			creator_title: 'New section',
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
			no_articles: 'You have not published any articles with selected tags',
			section_invisible:
				"In current language this section is only visible to you,<br> because it doesn't have description translation"
		}
	},
	page: {
		section: {
			no_articles: 'Author has not published any articles with selected tags',
			loading_more: 'Loading...',
			load_more: 'Load more'
		}
	},
	article_actor: {
		edit: 'Edit'
	},
	article_editor: {
		heading: 'Article Editing',
		title: 'Title',
		short_description: 'Short description',
		slug: 'Slug',
		content: 'Content',
		images: {
			label: 'Images',
			image_provider: 'Image Provider',
			provider_warning: 'Fill in the image provider to upload images',
			provider_explanation:
				"To upload images, create your own storage and share it's credentials with Plavna, it will only upload to it's own folder. You will have 5GB of space (instead of splitting 5GB among all users) and control over the images even if Plavna disappears. Currently, only ImageKit is supported.",
			fill_in_provider: 'Fill in',
			imagekit: {
				url_endpoint: 'URL Endpoint',
				public_key: 'Public Key',
				private_key: 'Private Key'
			},
			update: 'Update',
			delete: 'Delete',
			account_common: 'Сommon',
			article_specific: 'Of this article',
			new: 'New',
			main: 'Main',
			delete_whole: 'Delete',
			clear_translation: 'Delete translation',
			update_translation: 'Update',
			mark_for_deletion: 'Delete on Update',
			copy_code: 'Copy code'
		},
		tags: {
			list_label: 'Tags',
			template_editing_form_title: 'Tag',
			name_label: 'Name',
			edit_name_label: 'Edit name',
			delete: 'Delete',
			new_tag: 'New Tag',
			new: 'New',
			create: 'Create'
		},
		actions: {
			publish: 'Publish',
			hide: 'Hide',
			delete: 'Delete',
			view: 'View'
		},
		previews: {
			editor_title: 'Preview Settings',
			section_label: 'Preview',
			new: 'New',
			template_new_form_title: 'New Preview',
			template_editing_form_title: 'Preview Editing',
			create: 'Create',
			update: 'Update',
			set_and_update: 'Set and Update',
			delete: 'Delete',
			url: 'Address',
			url_placeholder: 'https://example.com',
			name: 'Name',
			image: 'Image',
			create_localized_screenshots: 'Create Localized Screenshots',
			image_dropzone: 'Drop image here or click to choose from folder',
			to_preview_the_preview: "See how it'll look",
			families: {
				modern: {
					name: 'Modern',
					text_bg_color: 'Text bg color',
					text_color: 'Text color',
					image: 'Image',
					image_depth: 'Image depth map',
					cols: 'Cols',
					rows: 'Rows'
				},
				sequences: {
					name: 'Sequences',
					text_bg_color: 'Text bg color',
					text_color: 'Text color',
					image: 'Image',
					image_depth: 'Image depth map',
					cols: 'Cols',
					rows: 'Rows'
				},
				custom: {
					name: 'Custom'
				}
			}
		}
	},
	settings: {
		heading: 'My Settings',
		username: 'Username',
		save: 'Save'
	}
};
