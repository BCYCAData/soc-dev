import type { HelpContent } from '$lib/types';

export const helpContentPersonalProfileMap: Record<string, HelpContent> = {
	'personal-profile': {
		hasHelp: true,
		title: 'Personal Profile Help',
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
	'personal-profile/about-me': {
		hasHelp: true,
		title: 'About Me',
		sections: [
			{
				title: 'Personal Information',
				content:
					'Fill out your personal information in this section. This helps others get to know you better.'
			},
			{
				title: 'Privacy Tip',
				content:
					'You can control the visibility of your personal information in the privacy settings.',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property': {
		hasHelp: false,
		title: 'My Property',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property/[propertyid]': {
		hasHelp: false,
		title: 'My Place',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property/[propertyid]/assets': {
		hasHelp: false,
		title: 'Property Assets',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property/[propertyid]/hazards': {
		hasHelp: false,
		title: 'Property Hazards',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property/[propertyid]/my-map': {
		hasHelp: true,
		title: 'Property Map',
		sections: [
			{
				title: 'Editing the map',
				content: 'Help on editing the map'
			},
			{
				title: 'This is a bit difficult',
				content: 'Read the instructions carefully',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-property/[propertyid]/resources': {
		hasHelp: false,
		title: 'Property Resources',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community': {
		hasHelp: false,
		title: 'My Community',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/bcyca': {
		hasHelp: false,
		title: 'BCYCA Community',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/bcyca/events': {
		hasHelp: false,
		title: 'Events',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/bcyca/information': {
		hasHelp: false,
		title: 'Information',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/bcyca/map': {
		hasHelp: false,
		title: 'BCYCA Map',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/bcyca/workshops': {
		hasHelp: false,
		title: 'Workshops',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/external': {
		hasHelp: false,
		title: 'External Community',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/external/events': {
		hasHelp: false,
		title: 'Events',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/external/information': {
		hasHelp: false,
		title: 'Information',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/external/map': {
		hasHelp: false,
		title: 'BCYCA Map',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/external/workshops': {
		hasHelp: false,
		title: 'Workshops',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/mondrook': {
		hasHelp: false,
		title: 'Mondrook Community',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/mondrook/events': {
		hasHelp: false,
		title: 'Events',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/mondrook/information': {
		hasHelp: false,
		title: 'Information',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/mondrook/map': {
		hasHelp: false,
		title: 'BCYCA Map',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/mondrook/workshops': {
		hasHelp: false,
		title: 'Workshops',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/tinonee': {
		hasHelp: false,
		title: 'Tinonee Community',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/tinonee/events': {
		hasHelp: false,
		title: 'Events',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/tinonee/information': {
		hasHelp: false,
		title: 'Information',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/tinonee/map': {
		hasHelp: false,
		title: 'BCYCA Map',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	},
	'personal-profile/my-community/tinonee/workshops': {
		hasHelp: false,
		title: 'Workshops',
		sections: [
			{
				title: '',
				content: ''
			},
			{
				title: '',
				content: '',
				importance: 'tip'
			}
		]
	}
};
