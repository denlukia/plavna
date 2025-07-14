// All new translations must have type equality assertion with EN translation
// Copy assertions from uk.ts upon creating new translation

export const EN = {
	layout: {
		language: 'Language',
		my_items: { pages: 'Pages', articles: 'Articles', settings: 'Settings' },
		my: 'My',
		no_translation: 'No translation',
		or: 'or',
		save: 'Save',
		only_for_big_screens: 'This Plavna page is available only for bigger screens for now',
		new_article: 'New article',
		previews: {
			screenshot_not_ready: 'Preview should be ready in a minute'
		}
	},
	actor_errors: {
		disallowed_chars: 'Only small latin letters, numbers and "-" are allowed',
		min_length: 'Min length is 3 symbols',
		max_length: 'Max length is 64 symbols',
		reserved_word: "Shouldn't be a reserved word",
		reserved_prefix: "Shoudn't start with a reserved prefix",
		at_least_one_translation: 'At least one translation is required',
		slug_in_use: 'You already use this slug',
		only_one_default_slug: 'You already have one main page',
		unknown_error: 'Unknown error',
		cannot_delete: "Couldn't delete",
		invalid_url: 'Invalid URL',
		at_least_one_title: 'Article should have title at least in one language'
	},
	main: {
		landing:
			"## Plavna is a free platform developed with Svelte 5 by Den Lukianenko for people to publish their portfolios and blogs. \n## For author it's like Medium where you can customize typography, colors and aesthetics, and each article preview can be truly yours and interactive. \n## For reader it's like The Verge where you can turn off uninteresting categories or switch to a calmer theme. \n## For me this is a project where I experiment with building apps completely independently: from design, through backend, frontend, and to deployment, polishing approaches on the way. \n## Plavna is focused on svelte, highly animated interface, because I believe: animation is not a decoration, but a fundamental property of the human world.",
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
		new: 'New page',
		themes: 'Themes',
		color_theme: 'Color',
		style_theme: 'Style',
		typography_markdown_theme: 'Typography'
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
			hidden_tags_tip: 'Leave text between [] empty to create a hidden tag mention',
			gotta_create_tags:
				'Create at least one tag during article creation to reference it in section',
			tag_name: 'Tag name',
			no_articles: 'You have not published any articles with selected tags',
			section_invisible:
				"In current language this section is only visible to you,<br> because it doesn't have description translation",
			add_tags_on_article_creation: 'You can create more tags while creating an article'
		}
	},
	page: {
		section: {
			no_articles: 'Author has not published any articles with selected tags',
			loading_more: 'Loading...',
			load_more: 'Load more'
		}
	},
	article: {
		back_to_articles: 'To articles'
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
			provider_warning: 'Fill in the image provider first',
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
			hidden_tag_tip: 'Start tag translations with * to make it hidden in article cards',
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
				'in-frame': {
					name: 'In Frame',
					frame_color: 'Frame color',
					mat_color: 'Mat color',
					image: 'Image',
					cols: 'Cols',
					rows: 'Rows'
				},
				sequences: {
					name: 'Sequences',
					text_bg_color: 'Text bg color',
					text_color: 'Text color',
					emoji_base_color: 'Emoji base color',
					emoji: 'Emojis',
					image: 'Image',
					image_depth: 'Image depth map',
					cols: 'Cols',
					rows: 'Rows',
					generate_emoji_image: 'Generate emoji grid'
				},
				'two-images': {
					name: 'Two Images',
					image_in_grid: 'Image in Grid',
					image_in_article: 'Image in Article',
					cols: 'Cols',
					rows: 'Rows',
					videos_folder: 'Videos to play on hover (folder URL)'
				},
				custom: {
					name: 'Custom',
					prop_1: 'Prop 1',
					prop_2: 'Prop 2',
					prop_3: 'Prop 3',
					prop_4: 'Prop 4',
					cols: 'Cols',
					rows: 'Rows',
					image_1: 'Image 1',
					image_2: 'Image 2',
					takes_a_minute: 'Custom previews take a minute to update'
				}
			}
		}
	},
	settings: {
		heading: 'My Settings',
		username: 'Username',
		save: 'Save',
		setup_username: 'Setup username'
	}
};
