import { describe, it } from 'mocha'
import { strictEqual, equal } from 'assert'
import { quadsToJson, jsonToQuads, getQuadsAndInfo } from '../lib/serialization.js'
import rdf from 'rdf-ext'
import Readable from 'readable-stream'

describe('lib.serialization', () => {
  it('roundtrip', async () => {

    const data = [
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Alice')),
      rdf.quad(rdf.namedNode('http://example/org/s1'), rdf.namedNode('http://xmlns.com/foaf/0.1/knows'), rdf.namedNode('http://example/org/o1')),
      rdf.quad(rdf.namedNode('http://example/org/o1'), rdf.namedNode('http://schema.org/name'), rdf.literal('Bob'))
    ]

    const json = await quadsToJson(data)
    const quads = await jsonToQuads(json)

    strictEqual(quads.length, 3)
  })

  it('serialize and info', async () => {

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

    const { info, quads } = await getQuadsAndInfo(await getReadable())

    strictEqual(info.length, 3)
    strictEqual(info[0], 'Array of length 1')
    strictEqual(info[1], 'DatasetExt of length 1')
    strictEqual(info[2], 'quad')

    strictEqual(quads.length, 3)

  })
})
