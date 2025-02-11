import type { HelpContent } from '$lib/types';

export const helpContentKYNGCoordinatorMap: Record<string, HelpContent> = {
	'kyng-coordinator': {
		hasHelp: true,
		title: 'KYNG Coordinator Help',
		sections: [
			{
				title: 'Getting Started',
				content:
					'Fill out your basic information in each section.\n\nRequired fields are marked with *'
			},
			{
				title: 'Important Note',
				content: 'Keep your contact information up to date',
				importance: 'warning'
			},
			{
				title: 'Tip',
				content: 'You can use the tab key to navigate between fields quickly',
				importance: 'tip'
			}
		]
	},
	'kyng-coordinator/[kyng_area]': {
		hasHelp: true,
		title: 'KYNG Area Help',
		sections: [
			{
				title: 'Getting Started',
				content:
					'Fill out your basic information in each section.\n\nRequired fields are marked with *'
			},
			{
				title: 'Important Note',
				content: 'Keep your contact information up to date',
				importance: 'warning'
			},
			{
				title: 'Tip',
				content: 'You can use the tab key to navigate between fields quickly',
				importance: 'tip'
			}
		]
	},
	'kyng-coordinator/[kyng_area]/map': {
		hasHelp: true,
		title: 'KYNG Area Map Help',
		sections: [
			{
				title: 'Getting Started',
				content:
					'Fill out your basic information in each section.\n\nRequired fields are marked with *'
			},
			{
				title: 'Important Note',
				content: 'Keep your contact information up to date',
				importance: 'warning'
			},
			{
				title: 'Tip',
				content: 'You can use the tab key to navigate between fields quickly',
				importance: 'tip'
			}
		]
	},
	'kyng-coordinator/[kyng_area]/unregistered-addresses': {
		hasHelp: true,
		title: 'KYNG Area Unregistered Addresses Help',
		sections: [
			{
				title: 'Getting Started',
				content:
					'Fill out your basic information in each section.\n\nRequired fields are marked with *'
			},
			{
				title: 'Important Note',
				content: 'Keep your contact information up to date',
				importance: 'warning'
			},
			{
				title: 'Tip',
				content: 'You can use the tab key to navigate between fields quickly',
				importance: 'tip'
			}
		]
	},
	'kyng-coordinator/[kyng_area]/user-admin': {
		hasHelp: true,
		title: 'KYNG Area User Admin Help',
		sections: [
			{
				title: 'Getting Started',
				content:
					'Fill out your basic information in each section.\n\nRequired fields are marked with *'
			},
			{
				title: 'Important Note',
				content: 'Keep your contact information up to date',
				importance: 'warning'
			},
			{
				title: 'Tip',
				content: 'You can use the tab key to navigate between fields quickly',
				importance: 'tip'
			}
		]
	}
};
