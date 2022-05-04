import Readable from 'readable-stream'
import getStream from 'get-stream'
import ParserJsonld from '@rdfjs/parser-jsonld'
import { jsonld } from '@rdfjs-elements/formats-pretty/serializers'

// I cannot find the node version of this method for Web
function readableFromArray (iterable) {
  const stream = new Readable({ objectMode: true })
  for (const current of iterable) {
    stream.push(current)
  }
  stream.push(null)
  return stream
}

// All below seriously inefficient, but it's for demo purposes only
async function jsonToQuads (json) {
  const input = new Readable({
    read: () => {
      input.push(JSON.stringify(json))
      input.push(null)
    }
  })
  const parserJsonld = new ParserJsonld()
  const output = parserJsonld.import(input)
  return await getStream.array(output)
}

async function quadsToJson (quads) {
  const sink = await jsonld()
  const stream = await sink.import(readableFromArray(quads))
  const result = await getStream(stream)
  return JSON.parse(result)
}

function isIterable (obj) {
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

async function getQuadsAndInfo (stream) {
  const info = []
  const quads = []
  for await (const chunk of stream) {
    if (isIterable(chunk)) {
      let count = 0
      for (const quad of chunk) {
        quads.push(quad)
        count = count + 1
      }
      const name = chunk.constructor?.name ? chunk.constructor?.name : 'iterable'
      info.push(`${name} of length ${count}`)

    } else {
      quads.push(chunk)
      info.push(`quad`)
    }
  }
  return { info, quads }
}

export { jsonToQuads, quadsToJson, getQuadsAndInfo, readableFromArray }
