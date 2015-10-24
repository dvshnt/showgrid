export const ADJUST_SIZE = 'ADJUST_SIZE';


export function adjustWindowSize(width, cells) {
	return {
		type: ADJUST_SIZE,
		width: width,
		cells: cells
	};
}