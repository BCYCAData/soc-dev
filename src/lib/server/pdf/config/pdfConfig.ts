import { join } from 'path';
import { pdfLogo } from '$lib/server/pdf/config/pdfImages';
import type { TFontDictionary } from 'pdfmake/interfaces';

const FONTS_PATH = join(process.cwd(), 'src/lib/server/pdf/fonts');

export const fonts: TFontDictionary = {
	Poppins: {
		normal: join(FONTS_PATH, 'poppins-latin-300-normal.woff'),
		bold: join(FONTS_PATH, 'poppins-latin-700-normal.woff')
	},
	Inter: {
		normal: join(FONTS_PATH, 'inter-latin-300-normal.woff'),
		bold: join(FONTS_PATH, 'inter-latin-700-normal.woff')
	},
	OpenSans: {
		normal: join(FONTS_PATH, 'open-sans-latin-300-normal.woff'),
		bold: join(FONTS_PATH, 'open-sans-latin-700-normal.woff')
	},
	NotoEmoji: {
		normal: join(FONTS_PATH, 'noto-emoji-emoji-400-normal.woff'),
		bold: join(FONTS_PATH, 'noto-emoji-emoji-400-normal.woff')
	},
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};

export const getLogo = () => pdfLogo;
