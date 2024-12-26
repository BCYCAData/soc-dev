export function createSVGWrapper(content: string, width: number, height: number): string {
	return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
}

export function createDefs(patterns: string[]): string {
	return `<defs>${patterns.join('')}</defs>`;
}
