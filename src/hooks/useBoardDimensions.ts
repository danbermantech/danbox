import { useBoardDimensionsContext } from "$contexts/BoardDimensionsContext";

export default function useBoardDimensions() {
  const { width, height } = useBoardDimensionsContext();
  return { width, height, boardWidth: width, boardHeight: height };
}