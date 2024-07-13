// shapes.ts

interface ShapeOptions {
	width: number;
	height: number;
	borderColor: string;
	borderWidth: number;
	borderStyle:
		| 'none'
		| 'hidden'
		| 'dotted'
		| 'dashed'
		| 'solid'
		| 'double'
		| 'groove'
		| 'ridge'
		| 'inset'
		| 'outset';
	fillColor: string;
	fillImage: string;
}

export class ShapeGenerator {
	private static generateCommonStyles(options: ShapeOptions): string {
		return `
      width: ${options.width || 8}px;
      height: ${options.height || 8}px;
      border: ${options.borderWidth || 1}px ${options.borderStyle || 'solid'} ${options.borderColor};
      background-color: ${options.fillColor};
	  background-image: ${options.fillImage || ''};

    `;
	}

	static square(options: ShapeOptions): string {
		if (options.width !== options.height) {
			console.warn(
				'For a square, width and height should be equal. Using width for both dimensions.'
			);
		}
		return `
      .square {
        ${this.generateCommonStyles({ ...options, height: options.width })}
      }
    `;
	}

	static circle(options: ShapeOptions): string {
		if (options.width !== options.height) {
			console.warn(
				'For a perfect circle, width and height should be equal. Using width for both dimensions.'
			);
		}
		const diameter = Math.min(options.width, options.height);
		return `
      .circle {
        ${this.generateCommonStyles({ ...options, width: diameter, height: diameter })}
        border-radius: 50%;
      }
    `;
	}

	static triangle(options: ShapeOptions): string {
		return `
      .triangle {
        width: 0;
        height: 0;
        border-left: ${options.width / 2}px solid transparent;
        border-right: ${options.width / 2}px solid transparent;
        border-bottom: ${options.height}px solid ${options.fillColor};
      }
    `;
	}

	static diamond(options: ShapeOptions): string {
		const size = Math.min(options.width, options.height);
		return `
      .diamond {
        ${this.generateCommonStyles({ ...options, width: size, height: size })}
        transform: rotate(45deg);
      }
    `;
	}

	static rectangle(options: ShapeOptions): string {
		return `
      .rectangle {
        ${this.generateCommonStyles(options)}
      }
    `;
	}

	static generateCSS(shapes: { [key: string]: ShapeOptions }): string {
		let css = '';

		for (const [shape, options] of Object.entries(shapes)) {
			switch (shape) {
				case 'square':
					css += this.square(options);
					break;
				case 'circle':
					css += this.circle(options);
					break;
				case 'triangle':
					css += this.triangle(options);
					break;
				case 'diamond':
					css += this.diamond(options);
					break;
				case 'rectangle':
					css += this.rectangle(options);
					break;
				default:
					console.warn(`Unknown shape: ${shape}`);
			}
		}

		return css;
	}
}

export function generateSquareStyle(
	width: number,
	height: number,
	border: string,
	fill: string
): string {
	return `
    width: ${width}px;
    height: ${height}px;
    border: ${border};
    background-color: ${fill};
  `;
}

export function generateCircleStyle(
	width: number,
	height: number,
	border: string,
	fill: string
): string {
	const radius = Math.min(width, height) / 2;
	return `
    width: ${width}px;
    height: ${height}px;
    border-radius: ${radius}px;
    border: ${border};
    background-color: ${fill};
  `;
}

export function generateTriangleStyle(
	width: number,
	height: number,
	border: string,
	fill: string
): string {
	return `
    width: 0;
    height: 0;
    border-left: ${width}px solid transparent;
    border-right: ${width}px solid transparent;
    border-bottom: ${height}px solid ${fill};
  `;
}

export function generateDiamondStyle(
	width: number,
	height: number,
	border: string,
	fill: string
): string {
	return `
    width: 0;
    height: 0;
    border: ${width}px solid transparent;
    border-bottom-color: ${fill};
    transform: rotate(45deg);
  `;
}

export function generateRectangleStyle(
	width: number,
	height: number,
	border: string,
	fill: string
): string {
	return `
    width: ${width}px;
    height: ${height}px;
    border: ${border};
    background-color: ${fill};
  `;
}

// .rhombus {
//     width: 100px;
//     height: 100px;
//     background: #3388ff;
//     transform: rotate(45deg);
// }

// .pentagon {
//     position: relative;
//     width: 54px;
//     height: 95px;
//     margin: 50px 0;
//     background: #3388ff;
//     border-width: 70px 40px 0;
//     border-style: solid;
//     border-color: #3388ff transparent;
// }
// .pentagon:before {
//     content: "";
//     position: absolute;
//     top: -35px;
//     left: 7.5px;
//     border-width: 0 60px 80px;
//     border-style: solid;
//     border-color: transparent transparent #3388ff;
// }

// .hexagon {
//     position: relative;
//     width: 100px;
//     height: 57.74px;
//     background: #3388ff;
//     margin: 30px 0;
// }
// .hexagon:before,
// .hexagon:after {
//     content: "";
//     position: absolute;
//     width: 0;
//     border-left: 50px solid transparent;
//     border-right: 50px solid transparent;
// }
// .hexagon:before {
//     bottom: 100%;
//     border-bottom: 28.87px solid #3388ff;
// }
// .hexagon:after {
//     top: 100%;
//     width: 0;
//     border-top: 28.87px solid #3388ff;
// }

// .octagon {
//     width: 100px;
//     height: 100px;
//     background:
//         linear-gradient(315deg, #3388ff 25%, transparent 25%) 0 0,
//         linear-gradient(225deg, #3388ff 25%, transparent 25%) 0 0,
//         linear-gradient(135deg, #3388ff 25%, transparent 25%) 0 0,
//         linear-gradient(45deg, #3388ff 25%, transparent 25%) 0 0,
//         linear-gradient(270deg, #3388ff 12.5%, transparent 12.5%) 0 0,
//         linear-gradient(90deg, #3388ff 12.5%, transparent 12.5%) 0 0,
//         linear-gradient(180deg, #3388ff 12.5%, transparent 12.5%) 0 0,
//         linear-gradient(0deg, #3388ff 12.5%, transparent 12.5%) 0 0;
//     background-repeat: no-repeat;
//     background-size: 100% 100%;
// }
