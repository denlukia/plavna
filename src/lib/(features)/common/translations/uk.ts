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
		username: "Ім'я користувача",
		user_id: 'ID Користувача',
		main_page: 'Основна',
		couldnt_create_page: 'Не вдалося створти сторінку і я не знаю чому',
		invalid_slug: 'Не підходяща адреса сторінки',
		slug_in_use: 'Така адреса сторінки у вас вже є',
		only_one_default_slug: 'Може існувати тільки одна сторінка за замовчуванням',
		delete_page: 'Видалити',
		couldnt_delete_page: 'Не вдалося видалити сторінку і я не знаю чому',
		edit_page: 'Змінити',
		couldnt_edit_page: 'Не вдалося змінити адресу сторінки і я не знаю чому',
		create_new_page: 'Створити сторінку',
		couldnt_save_article: 'Не вдалося зберігти пост і я не знаю чому',
		preview_custom: 'Кастомне превью',

		errors: {
			only_one_default: 'Ви вже маєте одну сторінку без імені',
			page_slug_exists: 'Ми вже маєте сторінку з таким іменем',
			disallowed_chars: 'Підходять тільки латинські літери, цифри та "-"',
			max_length: 'Не довше 15 символів'
		}
	},
	article_editor: {
		preview_plavna_modern: 'Плавна Сучасне'
	}
};

assert<TypeEqualityGuard<typeof EN, typeof UK>>();
