export const PATTERNS = {
	hatch: (id: string, color: string) => `
        <pattern id="${id}-hatch" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="${color}" stroke-width="1"/>
        </pattern>
    `,
	dots: (id: string, color: string) => `
        <pattern id="${id}-dots" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="1" fill="${color}"/>
        </pattern>
    `,
	grid: (id: string, color: string) => `
        <pattern id="${id}-grid" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M4,0 v4 M0,4 h4" stroke="${color}" stroke-width="0.5"/>
        </pattern>
    `
};

export const GRADIENTS = {
	linear: (id: string, color: string) => `
        <linearGradient id="${id}-linear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.3"/>
        </linearGradient>
    `,
	radial: (id: string, color: string) => `
        <radialGradient id="${id}-radial">
            <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0.3"/>
        </radialGradient>
    `
};

export const SHAPE_TEMPLATES = {
	square: (size: number, color: string) =>
		`<rect width="${size}" height="${size}" fill="${color}"/>`,

	diamond: (size: number, color: string) =>
		`<polygon points="${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}" fill="${color}"/>`,

	triangle: (size: number, color: string) =>
		`<polygon points="${size / 2},0 ${size},${size} 0,${size}" fill="${color}"/>`,

	'triangle-down': (size: number, color: string) =>
		`<polygon points="0,0 ${size},0 ${size / 2},${size}" fill="${color}"/>`,

	star: (size: number, color: string) =>
		`<path d="M${size / 2},0 L${size * 0.61},${size * 0.35} L${size},${size * 0.35} L${size * 0.68},${size * 0.57} L${size * 0.79},${size} L${size / 2},${size * 0.7} L${size * 0.21},${size} L${size * 0.32},${size * 0.57} L0,${size * 0.35} L${size * 0.39},${size * 0.35} Z" fill="${color}"/>`,

	'concentric-circle': (size: number, color: string) => `
        <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.4}" fill="${color}"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.2}" fill="white"/>`,

	'concentric-square': (size: number, color: string) => `
        <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="${color}"/>
        <rect x="${size * 0.3}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.4}" fill="white"/>`,

	'concentric-triangle': (size: number, color: string) => `
        <polygon points="${size / 2},${size * 0.1} ${size * 0.9},${size * 0.9} ${size * 0.1},${size * 0.9}" fill="${color}"/>
        <polygon points="${size / 2},${size * 0.4} ${size * 0.7},${size * 0.8} ${size * 0.3},${size * 0.8}" fill="white"/>`,

	'concentric-diamond': (size: number, color: string) => `
        <polygon points="${size / 2},${size * 0.1} ${size * 0.9},${size / 2} ${size / 2},${size * 0.9} ${size * 0.1},${size / 2}" fill="${color}"/>
        <polygon points="${size / 2},${size * 0.3} ${size * 0.7},${size / 2} ${size / 2},${size * 0.7} ${size * 0.3},${size / 2}" fill="white"/>`,

	wye: (size: number, color: string) =>
		`<path d="M${size / 2},0 L${size * 0.15},${size} L${size * 0.85},${size} Z M${size / 2},${size * 0.3} L${size / 2},${size * 0.7}" fill="${color}"/>`,

	cross: (size: number, color: string) =>
		`<path d="M${size * 0.2},${size * 0.2} L${size * 0.8},${size * 0.8} M${size * 0.2},${size * 0.8} L${size * 0.8},${size * 0.2}" stroke="${color}" stroke-width="${size * 0.2}"/>`,

	plus: (size: number, color: string) =>
		`<path d="M${size / 2},${size * 0.2} V${size * 0.8} M${size * 0.2},${size / 2} H${size * 0.8}" stroke="${color}" stroke-width="${size * 0.2}"/>`,

	ring: (size: number, color: string) =>
		`<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.35}" fill="none" stroke="${color}" stroke-width="${size * 0.15}"/>`,

	target: (size: number, color: string) => `
        <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.45}" fill="none" stroke="${color}" stroke-width="1"/>
        <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.25}" fill="${color}"/>`,

	hexagon: (size: number, color: string) =>
		`<polygon points="${size / 2},0 ${size},${size * 0.25} ${size},${size * 0.75} ${size / 2},${size} 0,${size * 0.75} 0,${size * 0.25}" fill="${color}"/>`,

	octagon: (size: number, color: string) =>
		`<polygon points="${size * 0.3},0 ${size * 0.7},0 ${size},${size * 0.3} ${size},${size * 0.7} ${size * 0.7},${size} ${size * 0.3},${size} 0,${size * 0.7} 0,${size * 0.3}" fill="${color}"/>`,

	pentagon: (size: number, color: string) =>
		`<polygon points="${size / 2},0 ${size},${size * 0.4} ${size * 0.8},${size} ${size * 0.2},${size} 0,${size * 0.4}" fill="${color}"/>`
};
