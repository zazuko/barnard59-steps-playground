import { append } from 'barnard59-rdf/metadata.js'
import { Readable } from 'readable-stream/readable-browser.js'
import { simpledata, simpleMetadata } from '../data.js'

const metadataAppendExample = {
  name: 'Append metadata',
  parameters: {
    dateModified: 'TIME_NOW',
    dateCreated: 'TIME_NOW'
  },
  inputs: [
    {
      title: 'Data (stream)',
      data: simpledata
    },
    {
      title: 'Metadata (input parameter)',
      data: simpleMetadata
    }
  ],
  operation: metadataAppend
}

async function metadataAppend (chunks, parameters = {}) {
  parameters.input = Readable.from(chunks[1])
  const transform = await append(parameters)
  const stream = Readable.from(chunks[0])
  stream.pipe(transform)
  return transform
}

export { metadataAppendExample }
