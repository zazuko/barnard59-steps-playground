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
      title: 'Observations 1 (dataset)',
      data: `@prefix schema: <http://schema.org/> .
@prefix schema: <http://schema.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://example.org/cube/observation> <https://cube.link/observation> <http://example.org/cube/observation/1>, <http://example.org/cube/observation/2> .

<http://example.org/cube/observation/1> a <https://cube.link/Observation> ;
        <http://cubes.org/property> <http://cubes.org/valueA> .
`
    },
    {
      title: 'Observations 2 (dataset)',
      data: `@prefix schema: <http://schema.org/> .
@prefix schema: <http://schema.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://example.org/cube/observation/2> a <https://cube.link/Observation> ;
        <http://cubes.org/property> <http://cubes.org/valueB> .
`
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
      title: 'Measure 1 (dataset)',
      data: `<http://example.org/topic/a> <http://example.org/property> "value" .`
    },
    {
      title: 'Measure 2 (dataset)',
      data: `<http://example.org/topic/a> <http://example.org/property> "another value" .`
    }
  ]
}

export { buildCubeShapeExample, toObservationExample }
