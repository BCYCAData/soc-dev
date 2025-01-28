import { read } from '$app/server';

import { pdfLogo } from '$lib/server/pdf/config/pdfImages';

import poppinsNormal from '$lib/server/pdf/fonts/poppins-latin-300-normal.woff';
import poppinsBold from '$lib/server/pdf/fonts/poppins-latin-700-normal.woff';
import interNormal from '$lib/server/pdf/fonts/inter-latin-300-normal.woff';
import interBold from '$lib/server/pdf/fonts/inter-latin-700-normal.woff';
import openSansNormal from '$lib/server/pdf/fonts/open-sans-latin-300-normal.woff';
import openSansBold from '$lib/server/pdf/fonts/open-sans-latin-700-normal.woff';
import notoEmojiNormal from '$lib/server/pdf/fonts/noto-emoji-emoji-400-normal.woff';
import notoEmojiBold from '$lib/server/pdf/fonts/noto-emoji-emoji-400-normal.woff';

import type { TFontDictionary } from 'pdfmake/interfaces';

export const fonts: TFontDictionary = {
	Poppins: {
		normal: await read(poppinsNormal).arrayBuffer(),
		bold: await read(poppinsBold).arrayBuffer()
	},
	Inter: {
		normal: await read(interNormal).arrayBuffer(),
		bold: await read(interBold).arrayBuffer()
	},
	OpenSans: {
		normal: await read(openSansNormal).arrayBuffer(),
		bold: await read(openSansBold).arrayBuffer()
	},
	NotoEmoji: {
		normal: await read(notoEmojiNormal).arrayBuffer(),
		bold: await read(notoEmojiBold).arrayBuffer()
	},
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};
// export const fonts: TFontDictionary = {
// 	Poppins: {
// 		normal: join(FONTS_PATH, 'poppins-latin-300-normal.woff'),
// 		bold: join(FONTS_PATH, 'poppins-latin-700-normal.woff')
// 	},
// 	Inter: {
// 		normal: join(FONTS_PATH, 'inter-latin-300-normal.woff'),
// 		bold: join(FONTS_PATH, 'inter-latin-700-normal.woff')
// 	},
// 	OpenSans: {
// 		normal: join(FONTS_PATH, 'open-sans-latin-300-normal.woff'),
// 		bold: join(FONTS_PATH, 'open-sans-latin-700-normal.woff')
// 	},
// 	NotoEmoji: {
// 		normal: join(FONTS_PATH, 'noto-emoji-emoji-400-normal.woff'),
// 		bold: join(FONTS_PATH, 'noto-emoji-emoji-400-normal.woff')
// 	},
// 	Helvetica: {
// 		normal: 'Helvetica',
// 		bold: 'Helvetica-Bold',
// 		italics: 'Helvetica-Oblique',
// 		bolditalics: 'Helvetica-BoldOblique'
// 	}
// };

export const getLogo = () => pdfLogo;
