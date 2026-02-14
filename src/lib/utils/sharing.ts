import { BikeColors, BikeDesign } from '@/types/bike';

export function encodeBuildToURL(colors: BikeColors, buildName: string): string {
  const colorString = Object.values(colors).join(',');
  const params = new URLSearchParams({
    colors: colorString,
    name: buildName
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function decodeBuildFromURL(): { colors: BikeColors | null; name: string | null } {
  if (typeof window === 'undefined') return { colors: null, name: null };
  
  const params = new URLSearchParams(window.location.search);
  const colorString = params.get('colors');
  const name = params.get('name');
  
  if (!colorString) return { colors: null, name };
  
  const colorValues = colorString.split(',');
  if (colorValues.length !== 5) return { colors: null, name };
  
  return {
    colors: {
      body: colorValues[0],
      wheels: colorValues[1],
      seat: colorValues[2],
      mirrors: colorValues[3],
      frame: colorValues[4]
    },
    name
  };
}

export function saveBuildToLocalStorage(build: BikeDesign): void {
  const builds = JSON.parse(localStorage.getItem('motoph_builds') || '[]');
  builds.unshift(build);
  localStorage.setItem('motoph_builds', JSON.stringify(builds.slice(0, 10)));
}

export function loadBuildsFromLocalStorage(): BikeDesign[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('motoph_builds') || '[]');
}

export function exportBuildAsJSON(build: BikeDesign): void {
  const dataStr = JSON.stringify(build, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${build.name.replace(/\s+/g, '-')}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyBuildLinkToClipboard(colors: BikeColors, buildName: string): Promise<boolean> {
  try {
    const url = encodeBuildToURL(colors, buildName);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}