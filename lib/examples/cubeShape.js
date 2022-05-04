import { observationChunk1, observationChunk2 } from '../data.js'
import { buildCubeShape } from 'barnard59-rdf/cube.js'
import { Readable } from 'readable-stream/readable-browser.js'

const cubeShapeExample = {
  name: 'Build cube shape',
  inputs: [
    {
      title: 'observations 1 (stream chunk)',
      data: observationChunk1
    },
    {
      title: 'observations 2 (stream chunk)',
      data: observationChunk2
    }
  ],
  operation: buildCubeShapeSimple
}

async function buildCubeShapeSimple (chunks, parameters = {}) {
  const transform = await buildCubeShape(parameters)
  const stream = Readable.from(chunks)
  stream.pipe(transform)
  return transform
}

export { cubeShapeExample }
