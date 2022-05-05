<script setup>
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'
import { quadsToJson, jsonToQuads } from '../../lib/serialization.js'

// Related to the examples
const directory = ref()
const START_INDEX = 0
const selectedIndex = ref(START_INDEX)

// The RDF editors
const current = ref({
  name: 'Step',
  text:'',
  operation: {
    title: '',
    data: '',
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
const selectedFormat = ref('text/turtle')

// Feedback
const error = ref()
const flowInfo = ref()

function getExampleURL () {
  return directory.value[selectedIndex.value].url
}

async function loadExample () {
  try {
    const res = await fetch(getExampleURL())
    const example = await res.json()
    updateResults([], [])
    current.value = example
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

function onQuadsChanged (e) {
  // console.log(e)
}

function onPrefixesParsed (e) {
  // console.log(e)
}

function updateResults (quads, info) {
  resultBoxRef.value.setQuads(quads)
  flowInfo.value = info
}

async function getJSONLdFromBoxes (ref) {

  if (!ref) {
    return []
  }

  const promises = Array.from(ref.children)
      .map((element) => Array.from(element.children))
      .flat()
      .filter((element) => element.tagName === 'RDF-EDITOR')
      .map(async (box) => {
        await box.ready
        return quadsToJson(box.quads)
      })
  return await Promise.all(promises)
}

async function transform () {

  const operation = await quadsToJson(await operationBoxRef.value.getQuads())
  const url = getExampleURL()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      operation: operation,
      inputChunks: await getJSONLdFromBoxes(inputChunksRef.value),
      inputParameters: await getJSONLdFromBoxes(inputParametersRef.value),
    })
  })
  if (res.status === 200) {
    const response = await res.json()
    updateResults(await jsonToQuads(response.output), response.flowInfo)
    error.value = null
  } else {
    updateResults ([], [])
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
          {{ item.name }}
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
    <Editbox
        ref="operationBoxRef"
        :content="current.operation.data"
        :format="selectedFormat"
        :title="current.operation.title"
        @onPrefixesParsed="onPrefixesParsed"
        @onQuadsChanged="onQuadsChanged"
    />

    <template v-if="current.inputParameters">
      <div ref="inputParametersRef" class="vertical">
        <template v-for="(item, index) in current.inputParameters">
          <Editbox
              :content="item.data"
              :format="selectedFormat"
              :index="index"
              :title="item.title"
              @onPrefixesParsed="onPrefixesParsed"
              @onQuadsChanged="onQuadsChanged"
          />
        </template>
      </div>
    </template>

    <template v-if="current.inputChunks">
      <h2>Input stream</h2>
      <div ref="inputChunksRef" class="vertical">
        <template v-for="(item, index) in current.inputChunks">
          <Editbox
              :content="item.data"
              :format="selectedFormat"
              :index="index"
              :title="item.title"
              @onPrefixesParsed="onPrefixesParsed"
              @onQuadsChanged="onQuadsChanged"
          />
        </template>
      </div>
    </template>

    <h2>Result</h2>
    <Editbox
        ref="resultBoxRef"
        :format="selectedFormat"
        @onPrefixesParsed="onPrefixesParsed"
        @onQuadsChanged="onQuadsChanged"
    />
    <div v-if="flowInfo">
      <h2>Outcoming flow</h2>
      <ol>
        <li v-for="outputChunk in flowInfo">{{ outputChunk }}</li>
      </ol>
    </div>

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
