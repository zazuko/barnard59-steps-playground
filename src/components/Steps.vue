<script setup>
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, onMounted, ref, watch } from 'vue'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'

const START_INDEX = 0

const directory = ref()
const selectedIndex = ref(START_INDEX)
const selectedFormat = ref('text/turtle')

const formats = [...parsers.keys()]
const boxes = ref([])

function getExampleURL(){
  const current = directory.value[selectedIndex.value]
  return current.url
}

async function loadExample () {
  const res = await fetch(getExampleURL())
  const def = await res.json()
  boxes.value = def.inputs
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

async function transform () {

  const quadsChunks = []
  for (const current of boxesRef.value.children) {
    for (const box of current.children) {
      if (box.tagName === 'RDF-EDITOR') {
        quadsChunks.push(box.quads)
      }
    }
  }
  const url = getExampleURL()
  console.log(url)
  console.log(quadsChunks)
  const res = await fetch(url,{
    method:'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      inputs: quadsChunks
    })
  })
  const response = await res.json()
  console.log(response)
  // const operation = steps[selectedIndex.value].operation
  // const stream = await operation(toRaw(box1.value.quads), toRaw(box2.value.quads))
  // const result = rdf.dataset()
  // for await (const dataset of stream) {
  //   result.addAll([...dataset])
  // }
  // const resultQuads = [...result]
  // await box3.value.setQuads(resultQuads)
}

</script>

<template>
  <Header/>
  <div>
    <div class="horizontal">
      <h3>Format</h3>
      <select v-model="selectedFormat">
        <option v-for="format in formats">
          {{ format }}
        </option>
      </select>
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
    </div>
    <Editbox
        ref="resultBox"
        :format="selectedFormat"
        :title="resultTitle"
        @onPrefixesParsed="onPrefixesParsed"
        @onQuadsChanged="onQuadsChanged"
    />

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
