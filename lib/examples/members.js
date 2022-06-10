const fromSourceExample = {
  title: 'Membership fromSource',
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
    code:link <node:barnard59-rdf/members.js#fromSource>   
  ] ;
  code:arguments [ code:name "sourceUri"; code:value "https://example.org/house" ],
               [ code:name "sourceClass"; code:value "https://example.org/Container" ],
               [ code:name "property"; code:value "https://example.org/contains" ],
               [ code:name "classes"; code:value ( "https://example.org/Person" "https://example.org/Cat" ) ] .
`
  },
  inputChunks: [
    {
      title: 'Data (quads)',
      data: `@prefix ex: <https://example.org/> .

ex:Alice a ex:Person .
ex:Bob a ex:Person .
ex:Fido a ex:Dog .
ex:Tom a ex:Cat .
`
    }
  ]
}

const toTargetExample = {
  title: 'Membership toTarget',
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
    code:link <node:barnard59-rdf/members.js#toTarget>   
  ] ;
  code:arguments [ code:name "targetUri"; code:value "https://example.org/house" ],
               [ code:name "targetClass"; code:value "https://example.org/Container" ],
               [ code:name "property"; code:value "https://example.org/in" ],
               [ code:name "classes"; code:value ( "https://example.org/Person" "https://example.org/Cat" ) ] .
`
  },
  inputChunks: [
    {
      title: 'Data 1 (quads)',
      data: `@prefix ex: <https://example.org/> .

ex:Alice a ex:Person .
ex:Bob a ex:Person .
ex:Fido a ex:Dog .
ex:Tom a ex:Cat .
`
    }
  ]
}


export { toTargetExample, fromSourceExample }
