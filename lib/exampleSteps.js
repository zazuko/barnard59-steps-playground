import { buildCubeShapeExample, toObservationExample } from './examples/cube.js'
import { appendExample, graphStatsExample } from './examples/metadata.js'

const exampleSteps = [
  buildCubeShapeExample,
  toObservationExample,
  appendExample,
  graphStatsExample
]

export { exampleSteps }
