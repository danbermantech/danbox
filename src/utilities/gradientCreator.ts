export default function gradientCreator(
  angle: number|string,
  startColor: string,
  endColor: string,
  midPoint: number
): string {
  return `linear-gradient(${angle}, ${startColor} 0%, ${startColor} ${midPoint}%, ${endColor} ${midPoint}%, ${endColor} 100%)`;
}