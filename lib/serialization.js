import rdf from 'rdf-ext'
import { Parser } from 'n3'

const parser = new Parser()

function toQuads (str) {
  return parser.parse(str)
}

function toString (quads) {
  const dataset = rdf.dataset().addAll(quads)
  return dataset.toString()
}

function isIterable (obj) {
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

async function getOutputChunksWithInfo (stream, serializer = async (x) => x) {
  const outputChunks = []
  for await (const chunk of stream) {
    if (isIterable(chunk)) {
      const quadsChunk = []
      let count = 0
      for (const quad of chunk) {
        quadsChunk.push(quad)
        count = count + 1
      }
      const name = chunk.constructor?.name ? chunk.constructor?.name : 'iterable'
      outputChunks.push({
        title: `${name} of length ${count}`,
        data: await serializer(quadsChunk)
      })
    } else {
      outputChunks.push({
        title: chunk.constructor?.name ? chunk.constructor?.name : 'quad',
        data: await serializer([chunk])
      })
    }
  }
  return outputChunks
}

export { getOutputChunksWithInfo, toQuads, toString }
