import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_pages: 'Мої сторінки',
		my: 'Мої',
		no_translation: 'Без перкладу',
		or: 'або'
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
		create: 'Створити',
		update: 'Оновити',
		slug: 'Адреса',
		username: "Ім'я користувача",
		user_id: 'ID Користувача',
		main_page: 'Основна',
		delete_page: 'Видалити',
		edit_page: 'Змінити',
		create_new_page: 'Створити нову',

		errors: {
			disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
			max_length: 'Не довше 15 символів',
			slug_in_use: 'Така адреса сторінки у вас вже є',
			only_one_default_slug: 'Може існувати тільки одна сторінка за замовчуванням'
		}
	},
	page_actor: {
		section: {
			editor_title: 'Секція',
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
			provider_explanation:
				'Я вирішив дозволити користувачам створювати власні сховища на 5 ГБ і дозволяти Plavna завантажувати у них, замість того, щоб ділити одне сховище на 5 ГБ на всіх. Ви можете створити безкоштовний обліковий запис ImageKit і надати його дані тут.',
			fill_in_provider: 'Заповнити'
		},
		tags: {
			list_label: 'Теги',
			template_editing_form_title: 'Тег',
			name_label: 'Назва',
			edit_name_label: 'Редагувати назву',
			delete: 'Видалити',
			new_tag: 'Новий тег',
			create: 'Створити'
		},
		actions: {
			publish: 'Опублікувати',
			hide: 'Приховати',
			delete: 'Видалити',
			view: 'Переглянути'
		},
		previews: {
			editor_title: 'Налаштування превʼю',
			section_label: 'Превʼю',
			add: 'Додати власне',
			template_new_form_title: 'Нове власне превʼю',
			template_editing_form_title: 'Редагування власного превʼю',
			create: 'Створити',
			update: 'Оновити',
			set_and_update: 'Обрати й оновити',
			delete: 'Видалити',
			url: 'Адреса',
			url_placeholder: 'https://example.com',
			name: 'Назва',
			image: 'Зображення',
			create_localized_screenshots: 'Створити локалізовані скріншоти',
			preview: 'Переглянути',
			image_dropzone: 'Перетягніть зображення або натисніть, щоб вибрати з папки',
			to_preview_the_preview: 'Переглянути превʼю',
			families: {
				plavna_modern: {
					name: 'Плавне й сучасне',
					text_bg_color: 'Колір тла',
					text_color: 'Колір тексту',
					image: 'Зображення',
					image_depth: 'Мапа глибини зображення'
				},
				custom: {
					name: 'Власне'
				}
			}
		}
	}
};

assert<TypeEqualityGuard<typeof EN, typeof UK>>();
