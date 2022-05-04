import { describe, it } from 'mocha'
import { strictEqual } from 'assert'
import { turtleToQuads } from '../lib/serialization.js'
import getStream from 'get-stream'
import { transforms } from '../lib/transforms.js'

async function executeDefaultTransform (transform) {
  const quadChunks = []
  for (const def of transform.inputs) {
    quadChunks.push(await turtleToQuads(def.data))
  }
  const resultStream = await transform.operation(quadChunks, transform.parameters)
  return await getStream.array(resultStream)
}

describe('lib.transforms', () => {
  it('can execute examples', async () => {

    for (const transform of transforms) {
      const result = await executeDefaultTransform(transform)
      strictEqual(result.length > 0, true, transform.name)
    }

  })

})
