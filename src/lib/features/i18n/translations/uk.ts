import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_pages: 'Мої сторінки',
		my: 'Мої'
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
	page: {
		section: {
			editor_title: 'Секція',
			create: 'Створити',
			update: 'Оновити',
			edit: 'Редагувати',
			delete: 'Видалити',
			cancel: 'Відмінити',
			description: 'Опис'
		}
	},
	article_editor: {
		preview_plavna_modern: 'Плавна Сучасне',
		preview_custom: 'Кастомне превью'
	}
};

assert<TypeEqualityGuard<typeof EN, typeof UK>>();
