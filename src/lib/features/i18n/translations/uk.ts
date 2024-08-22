import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_items: { pages: 'Cторінки', articles: 'Статті' },
		my: 'Мої',
		no_translation: 'Без перкладу',
		or: 'або',
		save: 'Зберегти'
	},
	auth: {
		signup: 'Реєстрація',
		login: 'Вхід',
		email: 'Електронна пошта',
		password: 'Пароль'
	},
	login: {
		to_login: 'Увійти',
		sign_in_with_github: 'Увійти з GitHub'
	},
	signup: {
		to_signup: 'Зареєструватися'
	},
	main: {
		landing: 'Лендинг',
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
		new: 'Нова',

		errors: {
			disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
			max_length: 'Не довше 15 символів',
			slug_in_use: 'Така адреса сторінки у вас вже є',
			only_one_default_slug: 'Може існувати тільки одна сторінка за замовчуванням'
		}
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
			create: 'Нова секція',
			update: 'Оновити',
			edit: 'Редагувати',
			delete: 'Видалити',
			cancel: 'Відмінити',
			description: 'Опис',
			available_tags: 'Доступні теги',
			gotta_create_tags:
				'Створіть хоч один тег під час створення статті щоб послатися на нього в секції',
			tag_name: 'Назва тега',
			no_articles: 'Ви ще не відмітили жодної стітті хоч одним обраним тегом',
			section_invisible: 'Поточною мовою ця секція видима лише вам,<br> адже не має переклад опису'
		}
	},
	page: {
		section: {
			no_articles: 'Автор ще не відмітив жодної стітті хоч одним обраним тегом'
		}
	},
	article_editor: {
		heading: 'Редагування статті',
		title: 'Заголовок',
		short_description: 'Короткий опис',
		slug: 'Адреса',
		content: 'Контент',
		images: {
			label: 'Зображення',
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
			to_preview_the_preview: 'Подивитись як виглядатиме',
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
	}
};

assert<TypeEqualityGuard<typeof EN, typeof UK>>();
