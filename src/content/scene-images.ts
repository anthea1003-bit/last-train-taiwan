const SCENE_FILES: Record<string, string> = {
  north: 'north-jiufen.webp',
  hsinchu_miaoli: 'taoyuan-neiwan.webp',
  central: 'central-sunmoon.webp',
  south_west: 'southwest-tainan.webp',
  kaohsiung_pingtung: 'kaohsiung-cijin.webp',
  east: 'east-taroko.webp',
  penghu: 'penghu-seventh.webp'
};

export function getAssetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

export function getSceneImage(regionId: string): string {
  const fileName = SCENE_FILES[regionId] ?? 'hero-night-train.webp';
  return getAssetUrl(`images/${fileName}`);
}
