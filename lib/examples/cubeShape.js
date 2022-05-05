import { observationChunk1, observationChunk2 } from '../data.js'
import { buildCubeShape } from 'barnard59-rdf/cube.js'
import { Readable } from 'readable-stream/readable-browser.js'

const cubeShapeExample = {
  name: 'Build cube shape',
  text: 'Generates a shape from a observations',
  operation: {
    title: 'Step definition',
    data: `@prefix ex: <https://example.org/> .
@prefix p:    <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .

ex:step a p:Step ;
  code:implementedBy [
    a code:EcmaScriptModule ;
    code:link <node:barnard59-rdf/cube.js#buildCubeShape>   
  ] .
`
  },
  inputChunks: [
    {
      title: 'observations 1 (stream chunk)',
      data: observationChunk1
    },
    {
      title: 'observations 2 (stream chunk)',
      data: observationChunk2
    }
  ]
}

export { cubeShapeExample }
