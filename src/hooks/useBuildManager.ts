import { useState, useEffect } from 'react';
import { BikeColors, BikeDesign } from '@/types/bike';
import {
  saveBuildToLocalStorage,
  loadBuildsFromLocalStorage,
  copyBuildLinkToClipboard,
  decodeBuildFromURL,
  exportBuildAsJSON
} from '@/lib/utils/sharing';

export function useBuildManager(initialColors: BikeColors) {
  const [buildName, setBuildName] = useState('My Custom NMAX');
  const [savedBuilds, setSavedBuilds] = useState<BikeDesign[]>([]);
  const [currentBuild, setCurrentBuild] = useState<BikeDesign | null>(null);

  // Load saved builds on mount
  useEffect(() => {
    const builds = loadBuildsFromLocalStorage();
    setSavedBuilds(builds);

    // Check if there's a shared build in URL
    const { colors, name } = decodeBuildFromURL();
    if (colors && name) {
      setBuildName(name);
      // You'll need to call a callback to apply these colors
    }
  }, []);

  const saveBuild = (colors: BikeColors, selectedParts: string[]) => {
    const build: BikeDesign = {
      name: buildName,
      bikeModel: 'NMAX 155',
      colors: { ...colors },
      selectedParts,
      createdAt: new Date().toISOString(),
      isPublic: false
    };

    saveBuildToLocalStorage(build);
    setSavedBuilds(prev => [build, ...prev]);
    setCurrentBuild(build);

    return build;
  };

  const shareBuild = async (colors: BikeColors) => {
    const success = await copyBuildLinkToClipboard(colors, buildName);
    return success;
  };

  const exportBuild = (colors: BikeColors, selectedParts: string[]) => {
    const build: BikeDesign = {
      name: buildName,
      bikeModel: 'NMAX 155',
      colors,
      selectedParts,
      createdAt: new Date().toISOString(),
      isPublic: false
    };
    exportBuildAsJSON(build);
  };

  const loadBuild = (build: BikeDesign) => {
    setCurrentBuild(build);
    setBuildName(build.name);
    return build.colors;
  };

  const deleteBuild = (buildId: string) => {
    const builds = savedBuilds.filter(b => b.createdAt !== buildId);
    setSavedBuilds(builds);
    localStorage.setItem('motoph_builds', JSON.stringify(builds));
  };

  return {
    buildName,
    setBuildName,
    savedBuilds,
    currentBuild,
    saveBuild,
    shareBuild,
    exportBuild,
    loadBuild,
    deleteBuild
  };
}