import { Readable } from 'readable-stream/readable-browser.js'
import { simpledata, simpleMetadata } from '../data.js'

const graphStatsExample = {
  title: 'Graph stats',
  inputStreamMode: 'quad stream',
  text: '',
  operation: {
    title: 'Step definition',
    data: `@prefix ex: <https://example.org/> .
@prefix p:    <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .

ex:step a p:Step ;
  code:implementedBy [
    a code:EcmaScriptModule ;
    code:link <node:barnard59-rdf/metadata.js#graphStats>   
  ] .
`
  },
  inputChunks: [
    {
      title: 'Data (stream)',
      inputStreamMode: 'quad stream',
      data: `@prefix ex: <https://example.org/> .
@prefix void: <http://rdfs.org/ns/void#> .
ex:dataset1 a void:Dataset .
ex:cube1 a <https://cube.link/Cube> .
ex:cube1 ex:prop1 ex:obj1 .
`
    }
  ],
}

const appendExample = {
  title: 'Append metadata',
  inputStreamMode: 'quad stream',
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

export { appendExample, graphStatsExample}
