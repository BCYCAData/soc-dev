import type L from 'leaflet';

declare module 'leaflet' {
	interface PMOptions {
		allowSelfIntersection?: boolean;
	}

	interface Map {
		pm: {
			addControls: (options: any) => void;
			removeControls: () => void;
			Toolbar: {
				createCustomControl: (options: {
					name: string;
					block: string;
					title: string;
					onClick: () => void;
					toggle: boolean;
					className: string;
				}) => void;
				getButtons: () => Record<string, any>;
			};
		};
	}

	interface FeatureGroup {
		pm: {
			enable: (options?: PMOptions) => void;
			disable: () => void;
		};
	}
}
