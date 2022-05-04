import { observationChunk1, observationChunk2 } from '../data.js'
import { buildCubeShape } from 'barnard59-rdf/cube.js'
import { Readable } from 'readable-stream/readable-browser.js'

const cubeShapeExample = {
  name: 'Build cube shape',
  inputs: [
    {
      title: 'Chunk of observations 1',
      data: observationChunk1
    },
    {
      title: 'Chunk of observations 2',
      data: observationChunk2
    }
  ],
  operation: buildCubeShapeSimple
}

async function buildCubeShapeSimple (...chunks) {
  const transform = await buildCubeShape()
  const stream = Readable.from(chunks)
  stream.pipe(transform)
  return transform
}

export { cubeShapeExample }
