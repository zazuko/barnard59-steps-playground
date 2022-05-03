<script setup>
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { onMounted, ref, toRaw } from 'vue'
import rdf from 'rdf-ext'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'
import { steps } from './lib.js'

const formats = [...parsers.keys()]
const dataset = ref(rdf.dataset())

const format = ref('text/turtle')

// RDF editors
const box1 = ref()
const content1 = ref()

const box2 = ref()
const content2 = ref()

const box3 = ref()
const content3 = ref()

// Libs
const selected = ref()
const exampleLib = ref(steps)

function loadExample (index) {
  const step = toRaw(exampleLib.value)[index]
  content1.value = step.content1
  content2.value = step.content2
}

onMounted(async () => {
  await loadExample(0)
})

function onQuadsChanged (e) {
  // console.log(e)
}

function onPrefixesParsed (e) {
  // console.log(e)
  // console.log(e.detail.prefixes)
}

async function transform (selected) {

  const getOperation = () => {
    for (const def of steps) {
      if (def.name === selected) {
        return def.operation
      }
    }
  }

  const oper = getOperation(selected)
  const stream = await oper(toRaw(box1.value.quads), toRaw(box2.value.quads))
  const result = rdf.dataset()
  for await (const dataset of stream) {
    result.addAll([...dataset])
  }
  const resultQuads = [...result]
  await box3.value.setQuads(resultQuads)
}

</script>


<template>
  <Header/>

  <div class="container">
    <h2>Input</h2>

    <select v-model="format">
      <option v-for="format in formats" :key="format" :value="format">
        {{ format }}
      </option>
    </select>
    <Editbox
      id="box1"
      ref="box1"
      :content="content1"
      :format="format"
      title="First chunk"
      @onPrefixesParsed="onPrefixesParsed"
      @onQuadsChanged="onQuadsChanged"
    />

    <Editbox
      id="box2"
      ref="box2"
      :content="content2"
      :format="format"
      title="Second chunk"
      @onPrefixesParsed="onPrefixesParsed"
      @onQuadsChanged="onQuadsChanged"
    />

    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option v-for="(item, index) in exampleLib" :key="item.name">
        {{ item.name }}
      </option>
    </select>
    <button v-if="selected" @click="transform(selected)">
      Do transform!
    </button>
    <Editbox
      id="box3"
      ref="box3"
      :format="format"
      :title="selected"
      @onPrefixesParsed="onPrefixesParsed"
      @onQuadsChanged="onQuadsChanged"
    />

  </div>

</template>
