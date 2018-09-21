import { randomBetween, roundToNearest } from './math';
import { closest } from './arrays';

export function numberToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
    return "#" + numberToHex(r) + numberToHex(g) + numberToHex(b);
}

export function randomColor() {
    const min = 50;
    const max = 200;
    const step = 50;
    
    const r = roundToNearest(randomBetween(min, max), step);
    const g = roundToNearest(randomBetween(min, max), step);
    const b = roundToNearest(randomBetween(min, max), step);
    
    return rgbToHex(r, g, b);
}