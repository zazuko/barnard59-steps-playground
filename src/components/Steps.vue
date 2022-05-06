<script setup>
import '@rdfjs-elements/rdf-editor'
import { onMounted, ref, watch } from 'vue'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'
import { toQuads, toString } from '../../lib/serialization.js'
import { parsers } from '@rdf-esm/formats-common'

// The examples
const directory = ref()
const START_INDEX = 0
const selectedIndex = ref(START_INDEX)

// The RDF editors
const current = ref({
  name: 'Step',
  text: '',
  operation: {
    title: '',
    quads: [],
  },
  inputChunks: [],
  inputParameters: []
})

// References to RDF Boxes
const operationBoxRef = ref()
const inputChunksRef = ref()
const inputParametersRef = ref()
const resultBoxRef = ref()

// Formats
const formats = [...parsers.keys()]
// const formats = ['application/n-quads', 'text/turtle']
const selectedFormat = ref('text/turtle')

// Feedback
const error = ref()

function getExampleURL () {
  return directory.value[selectedIndex.value].url
}

function toTitleAndQuads (chunk) {
  return {
    title: chunk.title,
    quads: toQuads(chunk.data)
  }
}

async function loadExample () {
  try {
    const res = await fetch(getExampleURL())
    const example = await res.json()
    const operation = example.operation ? toTitleAndQuads(example.operation) : {}
    const inputChunks = example.inputChunks ? example.inputChunks.map(toTitleAndQuads) : []
    const inputParameters = example.inputParameters ? example.inputParameters.map(toTitleAndQuads) : []
    current.value = {
      title: example.title,
      text: example.text,
      operation: operation,
      inputChunks: inputChunks,
      inputParameters: inputParameters
    }
    clearResults()
    error.value = null
  } catch (error) {
    error.value = error.message
  }
}

watch(() => selectedIndex.value, (index) => {
  loadExample(index)
})

onMounted(async () => {
  const res = await fetch('http://localhost:4000')
  directory.value = await res.json()
  await loadExample()
})

const result = ref({})

function clearResults(){
  result.value = null
}

function updateResults (response) {
  const outputChunks = response.outputChunks ? response.outputChunks.map(toTitleAndQuads) : []
  const aggregate = toQuads(toString(outputChunks.map(chunk => chunk.quads).flat())) // Remove duplicates
  result.value = {
    outputChunks: outputChunks,
    aggregate: aggregate
  }
}

function grabN3FromBoxes (ref) {
  if (!ref) {
    return []
  }
  return Array.from(ref.children)
      .map((element) => Array.from(element.children))
      .flat()
      .filter((element) => element.tagName === 'RDF-EDITOR')
      .map((box) => toString(box.quads))
}

async function transform () {

  const url = getExampleURL()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operation: grabN3FromBoxes(operationBoxRef.value)[0],
      inputChunks: grabN3FromBoxes(inputChunksRef.value),
      inputParameters: grabN3FromBoxes(inputParametersRef.value),
    })
  })
  if (res.status === 200) {
    const response = await res.json()
    updateResults(response)
    error.value = null
  } else {
    clearResults()
    error.value = await res.json()
  }

}

</script>

<template>

  <Header/>
  <div v-if="directory" class="container">
    <div class="controls">
      <select v-model="selectedIndex">
        <option disabled value="">Please select one</option>

        <option v-for="(item, index) in directory" :key="index" :value="index">
          {{ item.title }}
        </option>
      </select>
      <button @click="transform(selectedIndex)">
        Do transform!
      </button>
      <h4>Format</h4>
      <select v-model="selectedFormat">
        <option v-for="format in formats">
          {{ format }}
        </option>
      </select>
    </div>
    <div class="error">{{ error }}</div>
    <div>{{ current.text }}</div>

    <div ref="operationBoxRef" class="vertical">
      <Editbox
          :format="selectedFormat"
          :quads="current.operation.quads"
          :title="current.operation.title"
      />
    </div>

    <template v-if="current.inputParameters">
      <div ref="inputParametersRef" class="vertical">
        <template v-for="(item, index) in current.inputParameters">
          <Editbox
              :format="selectedFormat"
              :quads="item.quads"
              :title="item.title"
          />
        </template>
      </div>
    </template>

    <template v-if="current.inputChunks">
      <h2>Input stream</h2>
      <div ref="inputChunksRef" class="vertical">
        <template v-for="(item, index) in current.inputChunks">
          <Editbox
              :format="selectedFormat"
              :quads="item.quads"
              :title="item.title"
          />
        </template>
      </div>
    </template>

    <template v-if="result">
      <h2>Output stream</h2>
      <div class="vertical">
        <template v-for="(item, index) in result.outputChunks">
          <Editbox
              :format="selectedFormat"
              :quads="item.quads"
              :title="item.title"
          />
        </template>
      </div>
      <h2>Aggregate</h2>
      <Editbox
          ref="resultBoxRef"
          :format="selectedFormat"
          :quads="result.aggregate"
          readOnly="false"
      />
    </template>




  </div>
  <div v-else>
    <h3>Could not get examples from server</h3>
  </div>

</template>
<style>

.error {
  color: red;
}

.vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
