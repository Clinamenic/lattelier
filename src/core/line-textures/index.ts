import { LineTextureRenderer } from './base-texture';
import { SolidTextureRenderer } from './solid-texture';
import { SegmentedTextureRenderer } from './segmented-texture';
import { LineStyle } from '../../types/grid';

const textureRegistry = new Map<LineStyle, LineTextureRenderer>([
    ['solid', new SolidTextureRenderer()],
    ['segmented', new SegmentedTextureRenderer()],
]);

export function getTextureRenderer(style: LineStyle): LineTextureRenderer {
    return textureRegistry.get(style) || textureRegistry.get('solid')!;
}

