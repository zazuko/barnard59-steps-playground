import { append } from 'barnard59-rdf/metadata.js'
import { Readable } from 'readable-stream/readable-browser.js'
import { simpledata, simpleMetadata } from '../data.js'

const metadataAppendExample = {
  name: 'Append metadata',
  text: '',
  operation: {
    title: 'Step definition',
    data: `@prefix ex: <https://example.org/> .
@prefix p:    <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .

ex:step a p:Step ;
    code:implementedBy [
        a code:EcmaScriptModule ;
        code:link <node:barnard59-rdf/metadata.js#append>      
    ] ;
    code:arguments [ code:name "input"; code:value "metadata.txt" ],
                   [ code:name "dateCreated"; code:value  "2001" ],
                   [ code:name "dateModified"; code:value  "TIME_NOW" ] .`
  },
  inputChunks: [
    {
      title: 'Data (stream)',
      data: simpledata
    }
  ],
  inputParameters: [
    {
      title: 'metadata.txt',
      data: simpleMetadata
    }
  ],
  // I use this to bind the box of parameters to a parameter in the operation
  // Better ideas welcome.
  overwriteParams (parameters, parameterQuads) {
    parameters[0].input = Readable.from(parameterQuads[0])
    return parameters
  }
}

export { metadataAppendExample }
