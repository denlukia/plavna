import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_items: { pages: 'Cторінки', articles: 'Статті', settings: 'Налаштування' },
		my: 'Мої',
		no_translation: 'Без перекладу',
		or: 'або',
		save: 'Зберегти'
	},
	actor_errors: {
		disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
		min_length_3: 'Мінімальна довжина 3 символи',
		max_length_15: 'Не довше 15 символів',
		reserved_word: 'Не має бути зарезервованим словом',
		reserved_prefix: 'Не має починається з зарезервованого префікса',
		at_least_one_translation: 'Потрібнен мінімум один переклад',
		slug_in_use: 'Ви вже використовуєте цю адресу',
		only_one_default_slug: 'Ви вже маєте одну основну сторінку',
		unknown_error: 'Невідома помилка',
		cannot_delete: 'Не вдалося видалити'
	},
	main: {
		landing: 'Лендинг',
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
			provider_warning: 'Заповніть інформацію провайдера зображень щоб вивантажувати зображення',
			provider_explanation:
				'Щоб завантажувати зображення створіть власне сховище на і надайте його дані Плавній, вона завантажуватиме тільки у свою папку. Ви матимете 5ГБ місця (заміть того щоб діліти 5ГБ між всіма користувачами) а також контроль над зображеннями, навіть якщо Плавна зникне. Наразі підтримується тільки ImageKit.',
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
				plavna_modern: {
					name: 'Плавний і сучасний',
					text_bg_color: 'Колір тла',
					text_color: 'Колір тексту',
					image: 'Зображення',
					image_depth: 'Мапа глибини зображення',
					cols: 'Cтовпців',
					rows: 'Рядків'
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
		save: 'Зберегти'
	}
};

// TODO: Make more informative
assert<TypeEqualityGuard<typeof EN, typeof UK>>();
