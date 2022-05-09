import { observationChunk1, observationChunk2 } from '../data.js'

const buildCubeShapeExample = {
  title: 'Build cube shape',
  inputStreamMode: 'dataset stream',
  text: 'Builds a Cube Shape based on Cube Observation datasets',
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

const toObservationExample = {
  title: 'to Cube Observation',
  inputStreamMode: 'dataset stream',
  text: 'Converts a set of quads to a Cube Observation',
  operation: {
    title: 'Step definition',
    data: `@prefix ex: <https://example.org/> .
@prefix p:    <https://pipeline.described.at/> .
@prefix code: <https://code.described.at/> .

ex:step a p:Step ;
  code:implementedBy [
    a code:EcmaScriptModule ;
    code:link <node:barnard59-rdf/cube.js#toObservation>   
  ] .
`
  },
  inputChunks: [
    {
      title: 'measure 1 (stream chunk)',
      data: `<http://example.org/topic/a> <http://example.org/property> "value" .`
    },
    {
      title: 'measure 2 (stream chunk)',
      data: `<http://example.org/topic/a> <http://example.org/property> "another value" .`
    }
  ]
}


export { buildCubeShapeExample, toObservationExample }
