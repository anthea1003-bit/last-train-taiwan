export const SCENE_IMAGES: Record<string, string> = {
  north: '/images/north-jiufen.webp',
  hsinchu_miaoli: '/images/taoyuan-neiwan.webp',
  central: '/images/central-sunmoon.webp',
  south_west: '/images/southwest-tainan.webp',
  kaohsiung_pingtung: '/images/kaohsiung-cijin.webp',
  east: '/images/east-taroko.webp',
  penghu: '/images/penghu-seventh.webp'
};

export function getSceneImage(regionId: string): string {
  return SCENE_IMAGES[regionId] ?? '/images/hero-night-train.webp';
}
