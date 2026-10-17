import type { Size } from './types';

export interface Measurer {
  measure(label: string, shape: string): Size;
}

export class BrowserMeasurer implements Measurer {
  private ctx: CanvasRenderingContext2D | null = null;
  private font: string;
  private padX: number;
  private padY: number;

  constructor(font = '14px Karla, sans-serif', padX = 16, padY = 12) {
    this.font = font;
    this.padX = padX;
    this.padY = padY;
  }

  measure(label: string, shape: string): Size {
    // Lazy-load offscreen canvas measurement context
    if (!this.ctx) {
      try {
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');
      } catch (e) {
        // Fallback for non-browser/headless runtime environments
      }
    }

    let textWidth = label.length * 8; // default fallback character width
    if (this.ctx) {
      this.ctx.font = this.font;
      textWidth = this.ctx.measureText(label).width;
    }

    let width = textWidth + this.padX * 2;
    let height = 18 + this.padY * 2; // roughly 42px height for 14px font

    if (shape === 'circle') {
      const diameter = Math.max(width, height);
      const diag = Math.sqrt(textWidth * textWidth + 18 * 18);
      const minD = Math.ceil(diag + 24);
      width = Math.max(diameter, minD);
      height = width;
    } else if (shape === 'oval') {
      width = Math.ceil(textWidth * 1.35 + 24);
      height = Math.ceil(18 * 1.35 + 20);
    } else if (shape === 'diamond') {
      width = Math.ceil(textWidth * 1.5 + 32);
      height = Math.ceil(18 * 1.6 + 24);
    } else if (shape === 'actor' || shape === 'user') {
      const actorWidth = 32;
      const actorHeight = 48;
      width = Math.max(actorWidth, textWidth + 8);
      height = actorHeight + 20; // 20px extra for the bottom text label
    }

    return {
      width: Math.ceil(width),
      height: Math.ceil(height)
    };
  }
}

export class TestMeasurer implements Measurer {
  private padX: number;
  private charW: number;
  private fixedHeight: number;

  constructor(padX = 16, charW = 8, fixedHeight = 40) {
    this.padX = padX;
    this.charW = charW;
    this.fixedHeight = fixedHeight;
  }

  measure(label: string, shape: string): Size {
    const textWidth = label.length * this.charW;
    let width = this.padX * 2 + textWidth;
    let height = this.fixedHeight;

    if (shape === 'circle') {
      const diameter = Math.max(width, height);
      const diag = Math.sqrt(textWidth * textWidth + 18 * 18);
      const minD = Math.ceil(diag + 24);
      width = Math.max(diameter, minD);
      height = width;
    } else if (shape === 'oval') {
      width = Math.ceil(textWidth * 1.35 + 24);
      height = Math.ceil(18 * 1.35 + 20);
    } else if (shape === 'diamond') {
      width = Math.ceil(textWidth * 1.5 + 32);
      height = Math.ceil(18 * 1.6 + 24);
    } else if (shape === 'actor' || shape === 'user') {
      const actorWidth = 32;
      const actorHeight = 48;
      width = Math.max(actorWidth, textWidth + 8);
      height = actorHeight + 20;
    }

    return {
      width,
      height
    };
  }
}
