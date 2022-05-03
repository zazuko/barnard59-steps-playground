import { buildCubeShape } from 'barnard59-rdf/cube.js'
import { Readable } from 'readable-stream/readable-browser.js'
import { observationChunk1, observationChunk2 } from '@/components/data'

const steps = [
  {
    name: 'Build cube shape',
    content1: observationChunk1,
    content2: observationChunk2,
    operation: doTransform
  }
]

async function doTransform (chunk1, chunk2, metadata) {
  const transform = buildCubeShape()
  const stream = new Readable({ objectMode: true })

  stream.pipe(transform)
  stream.push(chunk1)
  stream.push(chunk2)
  stream.push(null)
  return transform
}

export { steps }
