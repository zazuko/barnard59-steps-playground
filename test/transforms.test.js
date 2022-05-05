import { describe, it } from 'mocha'
import { strictEqual } from 'assert'
import { turtleToQuads } from '../lib/serialization.js'
import getStream from 'get-stream'
import { exampleSteps } from '../lib/exampleSteps.js'
import { run } from '../lib/runner.js'

async function toQuadsAndRun (transform) {

  const inputChunksQuads = await Promise.all(transform.inputChunks.map((x) => x.data).map(turtleToQuads))
  const parametersQuads = transform.inputParameters ? await Promise.all(transform.inputParameters.map((x) => x.data).map(turtleToQuads)) : []
  const operationQuads = await turtleToQuads(transform.operation.data)
  const resultStream = await run(operationQuads, inputChunksQuads, parametersQuads, transform.overwriteParams)
  return await getStream.array(resultStream)
}

describe('lib.transforms', () => {
  it('examples execute and produce quads', async () => {

    for (const transform of exampleSteps) {
      const result = await toQuadsAndRun(transform)
      strictEqual(result.length > 0, true, transform.name)
    }

  })

})
