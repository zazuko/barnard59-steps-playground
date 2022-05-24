import { buildCubeShapeExample, toObservationExample } from './examples/cube.js'
import { appendExample, voidStatsExample } from './examples/metadata.js'
import { fromSourceExample, toTargetExample } from './examples/members.js'

const exampleSteps = [
  buildCubeShapeExample,
  toObservationExample,
  appendExample,
  voidStatsExample,
  // fromSourceExample,
  // toTargetExample
]

export { exampleSteps }
