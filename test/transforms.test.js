import { describe, it } from 'mocha'
import { strictEqual } from 'assert'
import { getOutputChunksWithInfo, toQuads, toString } from '../lib/serialization.js'
import { exampleSteps } from '../lib/exampleSteps.js'
import { prepareInputStream, run } from '../lib/runner.js'
import getStream from 'get-stream'

async function toQuadsAndRun (transform) {

  const parametersQuads = transform.inputParameters ? await Promise.all(transform.inputParameters.map((x) => x.data).map(toQuads)) : []
  const operationQuads = await toQuads(transform.operation.data)
  const inputChunksQuads = await Promise.all(transform.inputChunks.map((x) => x.data).map(toQuads))
  const inputStream = await prepareInputStream(inputChunksQuads, transform.inputStreamMode)
  return await run(operationQuads, inputStream, parametersQuads, transform.overwriteParams)
}

describe('examples execute and produce quads', async () => {
  exampleSteps.forEach(transform => {
    it(`for transform ${transform.title}`, async function () {
      const resultStream = await toQuadsAndRun(transform)
      const result = await getStream.array(resultStream)
      strictEqual(result.length > 0, true)
    })
  })
})


describe('resultStream can be serialized', async () => {
  exampleSteps.forEach(transform => {
    it(`for transform ${transform.title}`, async function () {
      const resultStream = await toQuadsAndRun(transform)
      const outputChunks = await getOutputChunksWithInfo(resultStream, async (quads) => await toString(quads))
      strictEqual(outputChunks.length > 0, true)
    })
  })
})
