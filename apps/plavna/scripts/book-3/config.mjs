// Book 3 (rationality, page "b3s") definition.
// Files are matched to GitHub dir listings by order; counts are asserted.
// { no } = global number from readthesequences.com (null = unnumbered, like interludes).
// { slug: null } = transliterate from the Ukrainian title.

export const USERNAME = 'rationality';
export const PAGE_SLUG = 'book-3-secret';
export const REPO = 'denlukia/rationality-ua-private';
export const BRANCH = 'main';
export const BOOK_DIR = '3. Машина у духові';
export const TEMPLATE_URL_MATCH = 'emoji-grid';
export const STUB_EMOJI = '📄📄';

export const PASTEL_BROWN = { bg: 'hsl(28deg, 45%, 78%)', text: '#000000', base: 'hsl(28deg, 55%, 66%)' };
// Book-1 chapter colors, reused for book-3 sections 2, 3, 4.
export const BOOK1_COLORS = [
	{ bg: '#cfdfe2', text: '#000000', base: null },
	{ bg: '#ffda72', text: '#000000', base: '#ffc544' },
	{ bg: '#b0f1ac', text: '#000000', base: '#8de888' }
];

export const CHAPTERS = [
	{
		dir: '[020] Вступ',
		tag: 'КН3 Вступ',
		files: [{ no: null, slug: 'minds-an-introduction' }]
	},
	{
		dir: '[030] Проста математика еволюції',
		tag: 'КН3 Розділ А',
		files: [
			{ no: null, slug: 'the-power-of-intelligence' },
			{ no: 131, slug: 'an-alien-god' },
			{ no: 132, slug: 'the-wonder-of-evolution' },
			{ no: 133, slug: 'evolutions-are-stupid-but-work-anyway' },
			{ no: 134, slug: 'no-evolutions-for-corporations-or-nanodevices' },
			{ no: 135, slug: 'evolving-to-extinction' },
			{ no: 136, slug: 'the-tragedy-of-group-selectionism' },
			{ no: 137, slug: 'fake-optimization-criteria' },
			{ no: 138, slug: 'adaptation-executers-not-fitness-maximizers' },
			{ no: 139, slug: 'evolutionary-psychology' },
			{ no: 140, slug: 'an-especially-elegant-evolutionary-psychology-experiment' },
			{ no: 141, slug: 'superstimuli-and-the-collapse-of-western-civilization' },
			{ no: 142, slug: 'thou-art-godshatter' }
		]
	},
	{
		dir: '[040] Крихкі цілі',
		tag: 'КН3 Розділ Б',
		files: [
			{ no: 143, slug: 'belief-in-intelligence' },
			{ no: 144, slug: 'humans-in-funny-suits' },
			{ no: 145, slug: 'optimization-and-the-intelligence-explosion' },
			{ no: 146, slug: 'ghosts-in-the-machine' },
			{ no: 147, slug: 'artificial-addition' },
			{ no: 148, slug: 'terminal-values-and-instrumental-values' },
			{ no: 149, slug: 'leaky-generalizations' },
			{ no: 150, slug: 'the-hidden-complexity-of-wishes' },
			{ no: 151, slug: 'anthropomorphic-optimism' },
			{ no: 152, slug: 'lost-purposes' }
		]
	},
	{
		dir: '[050] Путівник словами для людей',
		tag: 'КН3 Розділ В',
		files: [
			{ no: 153, slug: 'the-parable-of-the-dagger' },
			{ no: 154, slug: 'the-parable-of-hemlock' },
			{ no: 155, slug: 'words-as-hidden-inferences' },
			{ no: 156, slug: 'extensions-and-intensions' },
			{ no: 157, slug: 'similarity-clusters' },
			{ no: 158, slug: 'typicality-and-asymmetrical-similarity' },
			{ no: 159, slug: 'the-cluster-structure-of-thingspace' },
			{ no: 160, slug: 'disguised-queries' },
			{ no: 161, slug: 'neural-categories' },
			{ no: 162, slug: 'how-an-algorithm-feels-from-inside' },
			{ no: 163, slug: 'disputing-definitions' },
			{ no: 164, slug: 'feel-the-meaning' },
			{ no: 165, slug: 'the-argument-from-common-usage' },
			{ no: 166, slug: 'empty-labels' },
			{ no: 167, slug: 'taboo-your-words' },
			{ no: 168, slug: 'replace-the-symbol-with-the-substance' },
			{ no: 169, slug: 'fallacies-of-compression' },
			{ no: 170, slug: 'categorizing-has-consequences' },
			{ no: 171, slug: 'sneaking-in-connotations' },
			{ no: 172, slug: 'arguing-by-definition' },
			{ no: 173, slug: 'where-to-draw-the-boundary' },
			{ no: 174, slug: 'entropy-and-short-codes' },
			{ no: 175, slug: 'mutual-information-and-density-in-thingspace' },
			{ no: 176, slug: 'superexponential-conceptspace-and-simple-words' },
			{ no: 177, slug: 'conditional-independence-and-naive-bayes' },
			{ no: 178, slug: 'words-as-mental-paintbrush-handles' },
			{ no: 179, slug: 'variable-question-fallacies' },
			{ no: 180, slug: 'thirty-seven-ways-that-words-can-be-wrong' }
		]
	},
	{
		dir: '[060] Вичерпний посібник з використання теореми Баєса',
		tag: 'КН3 Розділ Г',
		// Not on readthesequences Book III page: unnumbered, transliterated slugs.
		files: Array.from({ length: 12 }, () => ({ no: null, slug: null }))
	}
];

// Sections in page order. `chapters` reference CHAPTERS indexes; display order
// within a section follows this order. First section carries the intro block.
export const SECTIONS = [
	{
		chapterTitle: 'Проста математика еволюції',
		letter: 'А',
		tags: ['КН3 Вступ', 'КН3 Розділ А'],
		chapters: [0, 1],
		colors: PASTEL_BROWN,
		intro: true
	},
	{
		chapterTitle: 'Крихкі цілі',
		letter: 'Б',
		tags: ['КН3 Розділ Б'],
		chapters: [2],
		colors: BOOK1_COLORS[0]
	},
	{
		chapterTitle: 'Путівник словами для людей',
		letter: 'В',
		tags: ['КН3 Розділ В'],
		chapters: [3],
		colors: BOOK1_COLORS[1]
	},
	{
		chapterTitle: 'Вичерпний посібник з використання теореми Баєса',
		letter: 'Г',
		tags: ['КН3 Розділ Г'],
		chapters: [4],
		colors: BOOK1_COLORS[2]
	}
];

// Existing tags to rename: translation key is resolved at runtime by tag id.
export const RENAMES = {
	25: 'КН1 Розділ А',
	26: 'КН1 Розділ Б',
	27: 'КН1 Розділ В',
	28: 'КН1 Розділ Г',
	29: 'КН1 Вступ',
	30: 'КН1 Інтерлюдія',
	42: 'КН2 Вступ',
	35: 'КН2 Розділ А',
	36: 'КН2 Розділ Б',
	37: 'КН2 Розділ В',
	38: 'КН2 Розділ Г',
	39: 'КН2 Розділ Ґ',
	40: 'КН2 Розділ Д',
	41: 'КН2 Розділ Е'
};
