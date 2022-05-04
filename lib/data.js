
const simpledata =`
@base <http://example.com> .
@prefix schema: <http://schema.org/> .

<john-doe> a schema:Person ;
  schema:name "John Doe" .
`

const simpleMetadata =`
@prefix ex: <http://example.org/> .
@prefix void: <http://rdfs.org/ns/void#> .
@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix schema: <http://schema.org/> .

ex:data
    a void:Dataset, dcat:Dataset, schema:Dataset ;
    schema:dateCreated   "2020-05-30"^^xsd:date ; # The date on which the CreativeWork was created or the item was added to a DataFeed.
    schema:dateModified  "2020-05-30"^^xsd:date ; # The date on which the CreativeWork was most recently modified or when the item's entry was modified within a DataFeed.
.
`

const observationChunk1 = `@prefix schema: <http://schema.org/> .
@prefix schema: <http://schema.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://example.org/cube/observation> <https://cube.link/observation> <http://example.org/cube/observation/1>, <http://example.org/cube/observation/2> .

<http://example.org/cube/observation/1> a <https://cube.link/Observation> ;
        <http://cubes.org/property> <http://cubes.org/valueA> .
`

const observationChunk2 = `@prefix schema: <http://schema.org/> .
@prefix schema: <http://schema.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<http://example.org/cube/observation/2> a <https://cube.link/Observation> ;
        <http://cubes.org/property> <http://cubes.org/valueB> .
`





export { observationChunk1, observationChunk2, simpleMetadata, simpledata}
