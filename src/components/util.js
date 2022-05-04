import rdf from 'rdf-ext'
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import { Readable } from 'readable-stream/readable-browser.js'
import { jsonld } from '@rdfjs-elements/formats-pretty/serializers'
import getStream from 'get-stream'

function shrink (term, customPrefixes = {}) {
  const factory = rdf.clone()
  for (const [prefix, uri] of Object.entries(prefixes)) {
    factory.prefixes.set(prefix, factory.namedNode(uri))
  }
  for (const [prefix, uri] of Object.entries(customPrefixes)) {
    factory.prefixes.set(prefix, factory.namedNode(uri))
  }
  return factory.prefixes.shrink(term) || term.value
}

function toStream (quads) {
  const stream = new Readable({ objectMode: true })
  quads.forEach(item => stream.push(item))
  stream.push(null)
  return stream
}

async function toJson (quads) {
  const sink = await jsonld()
  const stream = await sink.import(toStream(quads))
  return await getStream.array(stream)
}

export { shrink, toJson }
