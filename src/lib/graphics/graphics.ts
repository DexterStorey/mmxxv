export const calculateCorrectInverse = (probability: number) => {
  return 5 / probability
}

export const calculateIncorrectInverse = (probability: number) => {
  return 2 / probability
}

export const calculateCorrectPoints = (probability: number) => {
  return Math.min(100, 5 / probability)
}

export const calculateIncorrectPoints = (probability: number) => {
  return Math.min(50, 2 / probability)
}

export const generateDataPoints = (start: number, end: number, steps: number) => {
  const points: [number, number][] = []
  const step = (end - start) / steps
  
  for (let i = 0; i <= steps; i++) {
    const x = start + i * step
    points.push([x, x])
  }
  
  return points
} 