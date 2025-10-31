import { LineTextureRenderer } from './base-texture';
import { SolidTextureRenderer } from './solid-texture';
import { SegmentedTextureRenderer } from './segmented-texture';
import { LineTexture } from '../../types/grid';

const textureRegistry = new Map<LineTexture, LineTextureRenderer>([
    ['solid', new SolidTextureRenderer()],
    ['segmented', new SegmentedTextureRenderer()],
]);

export function getTextureRenderer(texture: LineTexture): LineTextureRenderer {
    return textureRegistry.get(texture) || textureRegistry.get('solid')!;
}

