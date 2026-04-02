import type { ProductImage } from '@/types';

/**
 * Get the full-size image URL from a ProductImage.
 * Falls back to thumbnailUrl if url is empty.
 */
export function getImageUrl(img: ProductImage | undefined | null): string {
  if (!img) return '';
  return img.url || img.thumbnailUrl || '';
}

/**
 * Get the thumbnail image URL from a ProductImage.
 * Falls back to url if thumbnailUrl is empty.
 */
export function getThumbnailUrl(img: ProductImage | undefined | null): string {
  if (!img) return '';
  return img.thumbnailUrl || img.url || '';
}

/**
 * Get the main product image URL (full-size).
 */
export function getMainImageUrl(images: ProductImage[] | undefined | null): string {
  if (!images?.length) return '';
  const main = images.find(img => img.isMain);
  return getImageUrl(main ?? images[0]);
}

/**
 * Get the main product thumbnail URL (for listings/cards).
 */
export function getMainThumbnailUrl(images: ProductImage[] | undefined | null): string {
  if (!images?.length) return '';
  const main = images.find(img => img.isMain);
  return getThumbnailUrl(main ?? images[0]);
}

/**
 * Get hover image URL (first non-main image).
 */
export function getHoverImageUrl(images: ProductImage[] | undefined | null): string {
  if (!images || images.length < 2) return '';

  const main = images.find(img => img.isMain) || images[0];
  const hover = images.find(img => img.url !== main.url) || images[1];

  return hover ? getThumbnailUrl(hover) : '';
}
