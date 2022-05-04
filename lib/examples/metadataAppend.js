import { append } from 'barnard59-rdf/metadata.js'
import { Readable } from 'readable-stream/readable-browser.js'
import { simpledata, simpleMetadata } from '../data.js'

const metadataAppendExample = {
  name: 'Append metadata',
  inputs: [
    {
      title: 'Data',
      data: simpledata
    },
    {
      title: 'Metadata',
      data: simpleMetadata
    }
  ],
  operation: metadataAppend
}

async function metadataAppend (...chunks) {
  const transform = await append({
    input: Readable.from(chunks[1]),
    dateModified: 'TIME_NOW'
  })
  const stream = Readable.from(chunks[0])
  stream.pipe(transform)
  return transform
}

export { metadataAppendExample }
