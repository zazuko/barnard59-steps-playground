import { Readable } from 'stream'
import defaultLoaderRegistry from 'barnard59-core/lib/defaultLoaderRegistry.js'
import rdf from 'rdf-ext'
import createArguments from 'barnard59-core/lib/factory/arguments.js'
import createOperation from 'barnard59-core/lib/factory/operation.js'

const code = rdf.namespace('https://code.described.at/')

const loaderRegistry = defaultLoaderRegistry()

async function createStep (ptr, { basePath, context, logger, variables }) {

  const args = await createArguments(ptr, { basePath, context, loaderRegistry, logger, variables })
  const operation = await createOperation(ptr.out(code.implementedBy), {
    basePath,
    context,
    loaderRegistry,
    logger,
    variables
  })

  return {
    args,
    operation
  }

}

async function run (operationQuads, inputChunksQuads, parametersQuads, overwriteParams) {
  const dataset = rdf.dataset().addAll(operationQuads)
  const ptr = rdf.clownface({
    dataset,
    term: rdf.namedNode('https://example.org/step')
  })
  const { args, operation } = await createStep(ptr, {})

  // Connects the RDF box as a param.
  const params = overwriteParams ? overwriteParams(args, parametersQuads) : args

  const transform = await operation.apply(this, params)
  const stream = Readable.from(inputChunksQuads)
  stream.pipe(transform)
  return transform
}

export { run }
