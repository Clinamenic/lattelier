export type ExportFormat = 'png' | 'svg' | 'gif' | 'json';
export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface ExportConfig {
    format: ExportFormat;
    width: number;
    height: number;
    scale: number;
    backgroundColor: string;
    transparent: boolean;
    frameRange?: [number, number];
    quality: ExportQuality;
    antialiasing: boolean;
}

