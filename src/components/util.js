import rdf from 'rdf-ext'
import prefixes from '@zazuko/rdf-vocabularies/prefixes'

function shrink (term, customPrefixes = {}) {
  const factory = rdf.clone()
  for (const [prefix, uri] of Object.entries(prefixes)) {
    factory.prefixes.set(prefix, factory.namedNode(uri))
  }
  for (const [prefix, uri] of Object.entries(customPrefixes)) {
    factory.prefixes.set(prefix, factory.namedNode(uri))
  }
  return factory.prefixes.shrink(term) || term.value
}

export {shrink}
