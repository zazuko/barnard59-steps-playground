const data = `@prefix schema: <http://schema.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<https://energy.ld.admin.ch/elcom/dataset/electricityprice/0> <http://example.org/property> "value1" ;
        a <https://cube.link/Observation> ;
        <https://cube.link/observedBy> <http://example.org/> .

<https://energy.ld.admin.ch/elcom/dataset/electricityprice> <https://cube.link/observation> <https://energy.ld.admin.ch/elcom/dataset/electricityprice/0>, <https://energy.ld.admin.ch/elcom/dataset/electricityprice/1> .

<https://energy.ld.admin.ch/elcom/dataset/electricityprice/1> <http://example.org/property> "value2" ;
        a <https://cube.link/Observation> ;
        <https://cube.link/observedBy> <http://example.org/> .
`
export { data }
