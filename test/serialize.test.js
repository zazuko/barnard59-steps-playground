import { describe, it } from 'mocha'
import { strictEqual } from 'assert'
import { getOutputChunksWithInfo, toQuads, toString } from '../lib/serialization.js'
import rdf from 'rdf-ext'
import Readable from 'readable-stream'

describe('lib.serialization', () => {
  it('can do roundtrip', async () => {

    const data = [
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Alice')),
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://xmlns.com/foaf/0.1/knows'), rdf.namedNode('http://example/org/o1')),
      rdf.quad(rdf.namedNode('http://example/org/o1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Bob'))
    ]

    const quads = toQuads(toString(data))

    strictEqual(quads.length, 3)
  })

  it('can serialize and info', async () => {

    const quadArray1 = [
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Alice'))
    ]

    const dataset = rdf.dataset([
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://xmlns.com/foaf/0.1/knows'), rdf.namedNode('http://example/org/o1')),
    ])

    const quad = rdf.quad(rdf.namedNode('http://example/org/o1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Bob'))

    function getReadable () {
      const stream = new Readable({ objectMode: true })
      stream.push(quadArray1)
      stream.push(dataset)
      stream.push(quad)
      stream.push(null)
      return stream
    }

    const outputChunks = await getOutputChunksWithInfo(await getReadable())

    strictEqual(outputChunks.length, 3)
    strictEqual(outputChunks[0].title, 'Array of length 1')
    strictEqual(outputChunks[1].title, 'DatasetExt of length 1')
    strictEqual(outputChunks[2].title, 'Quad')
    strictEqual(outputChunks[0].data.length, 1)
    strictEqual(outputChunks[1].data.length, 1)
    strictEqual(outputChunks[2].data.length, 1)
  })
})
