import { buildCubeShapeExample, toObservationExample } from './examples/cube.js'
import { appendExample, voidStatsExample } from './examples/metadata.js'

const exampleSteps = [
  buildCubeShapeExample,
  toObservationExample,
  appendExample,
  voidStatsExample
]

export { exampleSteps }
