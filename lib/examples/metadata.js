import { Readable } from 'readable-stream/readable-browser.js'

const voidStatsExample = {
  title: 'Void stats',
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
        code:link <node:barnard59-rdf/metadata.js#voidStats>      
    ] ;
    code:arguments [ code:name "voidDatasetUri"; code:value "https://example.org/dataset" ],
                   [ code:name "classPartitions"; code:value ( "https://example.org/Person" ) ],
                   [ code:name "propertyPartitions"; code:value ( "https://example.org/friendOf" "https://example.org/name" ) ] .
`
  },
  inputChunks: [
    {
      title: 'Data (stream)',
      inputStreamMode: 'quad stream',
      data: `@prefix ex: <https://example.org/> .

ex:Alice a ex:Person ;
    ex:name "Alice" .

ex:Bob a ex:Person ;
    ex:friendOf ex:Alice ;
    ex:name "Bob" .
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
    code:arguments [ code:name "input"; code:value "metadata.ttl" ],
                   [ code:name "dateCreated"; code:value  "2001" ],
                   [ code:name "dateModified"; code:value  "TIME_NOW" ] .`
  },
  inputChunks: [
    {
      title: 'Data (stream)',
      data: `
@base <http://example.com> .
@prefix schema: <http://schema.org/> .

<john-doe> a schema:Person ;
  schema:name "John Doe" .
`
    }
  ],
  inputParameters: [
    {
      title: 'metadata.ttl',
      data: `
@prefix ex: <http://example.org/> .
@prefix void: <http://rdfs.org/ns/void#> .
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .

ex:data
    a void:Dataset, dcat:Dataset, schema:Dataset ;
    schema:dateCreated   "1998"^^xsd:date ; # The date on which the CreativeWork was created or the item was added to a DataFeed.
    schema:dateModified  "1999"^^xsd:date ; # The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.
.
`
    }
  ],
  // I use this to bind the box of parameters to a parameter in the operation
  // Better ideas welcome.
  overwriteParams (parameters, parameterQuads) {
    parameters[0].input = Readable.from(parameterQuads[0])
    return parameters
  }
}

export { appendExample, voidStatsExample}
