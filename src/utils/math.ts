export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function smoothstep(t: number): number {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
}

/**
 * Convert hex color to HSL
 * @param hex - Hex color string (e.g., "#RRGGBB" or "#RGB")
 * @returns HSL object with h (0-360), s (0-1), l (0-1)
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    let hexColor = hex.replace('#', '');

    // Handle short form (#RGB -> #RRGGBB)
    if (hexColor.length === 3) {
        hexColor = hexColor
            .split('')
            .map((char) => char + char)
            .join('');
    }

    // Parse RGB values
    const r = parseInt(hexColor.substring(0, 2), 16) / 255;
    const g = parseInt(hexColor.substring(2, 4), 16) / 255;
    const b = parseInt(hexColor.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const l = (max + min) / 2;
    let s = 0;

    if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

        if (max === r) {
            h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / diff + 2) / 6;
        } else {
            h = ((r - g) / diff + 4) / 6;
        }
    }

    // Convert hue to degrees (0-360)
    h = h * 360;

    return { h, s, l };
}

/**
 * Convert HSL to hex color
 * @param h - Hue in degrees (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns Hex color string (e.g., "#RRGGBB")
 */
export function hslToHex(h: number, s: number, l: number): string {
    // Normalize hue to 0-360
    h = h % 360;
    if (h < 0) h += 360;

    // Clamp saturation and lightness
    s = clamp(s, 0, 1);
    l = clamp(l, 0, 1);

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    // Convert to 0-255 range and format as hex
    const toHex = (value: number): string => {
        const int = Math.round((value + m) * 255);
        const hex = int.toString(16).padStart(2, '0');
        return hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Apply hue variance to a hex color using a deterministic hash
 * @param hex - Base hex color string
 * @param variance - Variance amount (0-1), where 1 = maximum variation
 * @param hash - Deterministic hash value (0-1) for this element
 * @returns Hex color string with applied hue variation
 */
export function applyHueVariance(hex: string, variance: number, hash: number): string {
    if (variance <= 0) {
        return hex;
    }

    try {
        // Convert hex to HSL
        const hsl = hexToHsl(hex);

        // Calculate hue offset: (hash - 0.5) maps -0.5 to 0.5, then scale by variance
        // Maximum offset at 100% variance: ±45 degrees
        const maxHueOffset = 45;
        const hueOffset = (hash - 0.5) * variance * maxHueOffset;

        // Apply offset and handle wrapping around 360
        let newHue = hsl.h + hueOffset;
        if (newHue < 0) {
            newHue += 360;
        } else if (newHue >= 360) {
            newHue -= 360;
        }

        // Convert back to hex (preserve saturation and lightness)
        return hslToHex(newHue, hsl.s, hsl.l);
    } catch (error) {
        // If conversion fails, return original color
        return hex;
    }
}

