import { buildCubeShape } from 'barnard59-rdf/cube.js'
import { Readable } from 'readable-stream/readable-browser.js'
import { observationChunk1, observationChunk2, metadata, simpledata } from './data.js'

const transforms = [
  {
    name: 'Build cube shape',
    inputs: [
      {
        title: 'First chunk',
        data: observationChunk1
      },
      {
        title: 'Second chunk',
        data: observationChunk2
      }
    ],
    operation: buildCubeShapeSimple
  },
  {
    name: 'Graph stats, data catalog',
    inputs: [
      {
        title: 'Data',
        data: simpledata
      },
      {
        title: 'Metadata',
        data: metadata
      }
    ],
    operation: buildCubeShapeSimple
  }
]

function buildCubeShapeSimple (...chunks) {
  const transform = buildCubeShape()
  const stream = Readable.from(chunks)
  stream.pipe(transform)
  return transform
}

export { transforms }
