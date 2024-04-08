import { assert, type TypeEqualityGuard } from '@denlukia/plavna-common/types';

import type { EN } from './en';

export const UK = {
	layout: {
		language: 'Мова',
		my_pages: 'Мої сторінки'
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
	user_pages: {
		create: 'Створити',
		update: 'Оновити',
		slug: 'Адреса',
		username: "Ім'я користувача",
		user_id: 'ID Користувача',
		main_page: 'Основна',
		delete_page: 'Видалити',
		edit_page: 'Змінити',
		create_new_page: 'Створити нову',
		preview_custom: 'Кастомне превью',

		errors: {
			disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
			max_length: 'Не довше 15 символів',
			slug_in_use: 'Така адреса сторінки у вас вже є',
			only_one_default_slug: 'Може існувати тільки одна сторінка за замовчуванням'
		}
	},
	article_editor: {
		preview_plavna_modern: 'Плавна Сучасне'
	}
};

assert<TypeEqualityGuard<typeof EN, typeof UK>>();
