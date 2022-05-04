<script setup>
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, onMounted, ref, watch } from 'vue'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'
import { quadsToJson, jsonToQuads } from '../../lib/serialization.js'

const START_INDEX = 0

const directory = ref()
const selectedIndex = ref(START_INDEX)
const selectedFormat = ref('text/turtle')

const error = ref()

const formats = [...parsers.keys()]
const boxes = ref([])

function getExampleURL () {
  const current = directory.value[selectedIndex.value]
  return current.url
}

async function loadExample () {

  try {
    const res = await fetch(getExampleURL())
    const def = await res.json()
    updateResults([], [])
    parameters.value = def.parameters ? JSON.stringify(def.parameters, null, 2) : '{}'
    boxes.value = def.inputs
  } catch {
    directory.value = null
  }

}

watch(() => selectedIndex.value, (index) => {
  loadExample(index)
})

const resultTitle = computed(() => {
  return directory.value ? directory.value[selectedIndex.value].name : 'Result'
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
  // console.log(e.detail.prefixes)
}

const boxesRef = ref()
const resultBoxRef = ref()
const flowInfo = ref()
const parameters = ref()

function updateResults (quads, info) {
  resultBoxRef.value.setQuads(quads)
  flowInfo.value = info
}

async function transform () {

  const jsonChunks = []
  for (const current of boxesRef.value.children) {
    for (const box of current.children) {
      if (box.tagName === 'RDF-EDITOR') {
        jsonChunks.push(await quadsToJson(box.quads))
      }
    }
  }

  const url = getExampleURL()
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs: jsonChunks,
      parameters: parameters.value
    })
  })
  if (res.status === 200) {
    const response = await res.json()
    updateResults(await jsonToQuads(response.output), response.flowInfo)
  } else {
    error.value = await res.json()
  }

}

const parametersValid = computed(() => {

  try {
    JSON.parse(parameters.value)
  } catch (error) {
    return error.message
  }
  return null

})

</script>

<template>
  <Header/>
  <div v-if="directory" class="vertical">
    <div class="horizontal">
      <h3>Step</h3>
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
    <div>{{ error }}</div>
    <div class="horizontal">
      <h4>Parameters</h4>
      <textarea v-model="parameters" cols="80" rows="5"></textarea>
      {{ parametersValid }}
    </div>
    <div ref="boxesRef" class="vertical">
      <template v-for="(item, index) in boxes">
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

    <h2>Result</h2>
    <Editbox
        ref="resultBoxRef"
        :format="selectedFormat"
        :title="resultTitle"
        @onPrefixesParsed="onPrefixesParsed"
        @onQuadsChanged="onQuadsChanged"
    />
    <div v-if="flowInfo">
      <h3>Outcoming flow</h3>
      <ol>
        <li v-for="current in flowInfo">{{ current }}</li>
      </ol>
    </div>

  </div>
  <div v-else>
    <h3>Could not get examples from server</h3>
  </div>

</template>
<style>
.vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.horizontal {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
