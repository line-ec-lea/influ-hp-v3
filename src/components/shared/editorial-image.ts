export function editorialImageDimensions(image: { width?: number; height?: number }, maxWidth = 600) {
  const width = image.width || maxWidth;
  const height = image.height || width * 2 / 3;
  // Keep 2× responsive variants inside EmDash's 4000px transform limit.
  const scale = Math.min(1, maxWidth / width, 2000 / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
