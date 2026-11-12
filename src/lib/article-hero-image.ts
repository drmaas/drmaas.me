/** 16:9 defaults for post hero images (matches `aspect-video`). */
export const DEFAULT_ARTICLE_HERO_WIDTH = 1280;
export const DEFAULT_ARTICLE_HERO_HEIGHT = 720;

export function articleHeroDimensions(
  width?: number,
  height?: number,
): { width: number; height: number } {
  return {
    width: width ?? DEFAULT_ARTICLE_HERO_WIDTH,
    height: height ?? DEFAULT_ARTICLE_HERO_HEIGHT,
  };
}

/** Matches `w-full` on small viewports and `md:w-10/12` within `max-w-7xl`. */
export const ARTICLE_HERO_SIZES =
  "(min-width: 768px) min(83.333vw, 1280px), 100vw";
