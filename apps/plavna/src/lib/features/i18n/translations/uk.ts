import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_items: { pages: 'Cторінки', articles: 'Статті', settings: 'Налаштування' },
		my: 'Мої',
		no_translation: 'Без перекладу',
		or: 'або',
		save: 'Онов.',
		only_for_big_screens: 'Наразі ця сторінка в Плавна доступна лише для більших екранів',
		new_article: 'Нова стаття'
	},
	actor_errors: {
		disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
		min_length: 'Мінімальна довжина 3 символи',
		max_length: 'Не довше 64 символів',
		reserved_word: 'Не має бути зарезервованим словом',
		reserved_prefix: 'Не має починається з зарезервованого префікса',
		at_least_one_translation: 'Потрібнен мінімум один переклад',
		slug_in_use: 'Ви вже використовуєте цю адресу',
		only_one_default_slug: 'Ви вже маєте одну основну сторінку',
		unknown_error: 'Невідома помилка',
		cannot_delete: 'Не вдалося видалити'
	},
	main: {
		landing:
			"## Plavna — безкоштовний сервіс, що розробяється Денисом Лук'яненком на Svelte, для публікації дизайн/фронтенд портфоліо та блогів. \n ## Для авторів це як Medium, де вони можуть налаштувати не лише шапку, а й типографіку, кольори та естетику, а кожна обкладинка статті може бути кастомною та інтерактивною. \n ## Для читачів це як NYT, де можна вимкнути всі нецікаві категорії, та як The Verge, де можна переключитися на більш легку тему. \n ## Для мене це проект, де я намагаюся об'єднати те, чого навчився за роки дизайна та розробки. \n ## Plavna орієнтована на легкий високоанімований інтерфейс, адже її автор вважає: анімація — не прикраса, а суттєва властивість людського світу.",
		sign_in_with_github: 'Увійти з GitHub',
		to_sign_out: 'Вийти'
	},
	pages_list: {
		title: 'Мої сторінки',
		create: 'Створити',
		update: 'Оновити',
		slug: 'Адреса',
		username: "Ім'я користувача",
		user_id: 'ID Користувача',
		main_page: 'Основна',
		delete_page: 'Видалити',
		edit_page: 'Змінити',
		new: 'Нова'
	},
	articles_list: {
		title: 'Мої статті',
		edit: 'Редагувати',
		delete: 'Видалити',
		hide: 'Приховати',
		publish: 'Опублікувати'
	},
	page_actor: {
		section: {
			editor_title: 'Секція',
			creator_title: 'Нова секція',
			create: 'Створити',
			update: 'Оновити',
			edit: 'Редагувати',
			delete: 'Видалити',
			cancel: 'Відмінити',
			description: 'Опис',
			available_tags: 'Доступні теги',
			hidden_tags_tip: 'Залиште текст між [] пустим щоб створити приховане згадування тега',
			gotta_create_tags:
				'Створіть хоч один тег під час створення статті щоб послатися на нього в секції',
			tag_name: 'Назва тега',
			no_articles: 'Ви ще не опублікували жодної стітті з обраними тегами',
			section_invisible: 'Поточною мовою ця секція видима лише вам,<br> адже не має переклад опису'
		}
	},
	page: {
		section: {
			no_articles: 'Автор ще не опублікував жодної стітті з обраними тегами',
			loading_more: 'Завантажую...',
			load_more: 'Завантажити більше'
		}
	},
	article: {
		back_to_articles: 'До статей'
	},
	article_actor: {
		edit: 'Редагувати'
	},
	article_editor: {
		heading: 'Редагування статті',
		title: 'Заголовок',
		short_description: 'Короткий опис',
		slug: 'Адреса',
		content: 'Контент',
		images: {
			label: 'Зображ.',
			image_provider: 'Провайдер зображень',
			provider_warning: 'Спочатку заповніть інформацію провайдера зображень',
			provider_explanation:
				'Щоб завантажувати зображення створіть власне сховище і надайте його дані Плавній, вона завантажуватиме тільки у свою папку. Ви матимете 5ГБ місця (заміть того щоб діліти 5ГБ між всіма користувачами) а також контроль над зображеннями, навіть якщо Плавна зникне. Наразі підтримується тільки ImageKit.',
			fill_in_provider: 'Заповнити',
			imagekit: {
				url_endpoint: 'URL Кінцева точка',
				public_key: 'Публічний ключ',
				private_key: 'Приватний ключ'
			},
			update: 'Оновити',
			delete: 'Видалити',
			account_common: 'Спільні',
			article_specific: 'Цієї статті',
			new: 'Нове',
			main: 'Основне',
			delete_whole: 'Видалити',
			clear_translation: 'Видалити переклад',
			update_translation: 'Оновити переклад',
			mark_for_deletion: 'Видалити при оновленні',
			copy_code: 'Копіювати код'
		},
		tags: {
			list_label: 'Теги',
			hidden_tag_tip: 'Починайте переклади тега з * щоб зробити його невидимим у картках статей',
			template_editing_form_title: 'Тег',
			name_label: 'Назва',
			edit_name_label: 'Редагувати назву',
			delete: 'Видалити',
			new_tag: 'Новий тег',
			new: 'Новий',
			create: 'Створити'
		},
		actions: {
			publish: 'Опублікувати',
			hide: 'Приховати',
			delete: 'Видалити',
			view: 'Переглянути'
		},
		previews: {
			editor_title: 'Налашт. передогляду',
			section_label: 'Передогляд',
			new: 'Новий',
			template_new_form_title: 'Новий передогляд',
			template_editing_form_title: 'Редагування передогляду',
			create: 'Створити',
			update: 'Оновити',
			set_and_update: 'Обрати й оновити',
			delete: 'Видалити',
			url: 'Адреса',
			url_placeholder: 'https://example.com',
			name: 'Назва',
			image: 'Зображення',
			create_localized_screenshots: 'Створити локалізовані скріншоти',
			image_dropzone: 'Перетягніть зображ. або натисніть, щоб вибрати',
			to_preview_the_preview: 'Переглянути',
			families: {
				modern: {
					name: 'Cучасний',
					text_bg_color: 'Колір тла',
					text_color: 'Колір тексту',
					image: 'Зображення',
					image_depth: 'Мапа глибини зображення',
					cols: 'Cтовпців',
					rows: 'Рядків'
				},
				sequences: {
					name: 'Секвенції',
					text_bg_color: 'Колір тла',
					text_color: 'Колір тексту',
					emoji_base_color: 'Колір емоджі',
					emoji: 'Емоджі',
					image: 'Зображення',
					image_depth: 'Мапа глибини зображення',
					cols: 'Cтовпців',
					rows: 'Рядків',
					generate_emoji_image: 'Згенерувати сітку емоджі'
				},
				custom: {
					name: 'Власне'
				}
			}
		}
	},
	settings: {
		heading: 'Мої налаштування',
		username: "Ім'я користувача",
		save: 'Зберегти',
		setup_username: 'Налаштувати імʼя користувача'
	}
};

// TODO: Make more informative
assert<TypeEqualityGuard<typeof EN, typeof UK>>();
