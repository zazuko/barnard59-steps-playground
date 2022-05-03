<script setup>
import 'splitpanes/dist/splitpanes.css'
import '@rdfjs-elements/rdf-editor'
import { parsers } from '@rdf-esm/formats-common'
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue'
import rdf from 'rdf-ext'
import { chunk1, chunk2, metadata } from '@/components/data.js'
import Header from './Header.vue'
import Editbox from '@/components/Editbox'

const formats = [...parsers.keys()]
const dataset = ref(rdf.dataset())

const format = ref('text/turtle')

const box1 = ref()
const box2 = ref()
const box3 = ref()

const content1 = ref(chunk1)
const content2 = ref(chunk2)
const content3 = ref(metadata)

async function register (refBox, refContent) {

}

onMounted(async () => {

})

function onQuadsChanged (e) {
  // console.log(e)
}

function onPrefixesParsed (e) {
  // console.log(e)
  // console.log(e.detail.prefixes)
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
      title="First chunk"
      ref="box1"
      id="box1"
      :content="content1"
      :format="format"
      @onQuadsChanged="onQuadsChanged"
      @onPrefixesParsed="onPrefixesParsed"
    />
    <Editbox
      title="Second chunk"
      ref="box2"
      id="box2"
      :content="content2"
      :format="format"
      @onQuadsChanged="onQuadsChanged"
      @onPrefixesParsed="onPrefixesParsed"
    />
<!--    <Editbox-->
<!--      title="Metadata"-->
<!--      ref="box3"-->
<!--      id="box3"-->
<!--      :content="content3"-->
<!--      :format="format"-->
<!--      @onQuadsChanged="onQuadsChanged"-->
<!--      @onPrefixesParsed="onPrefixesParsed"-->
<!--    />-->
  </div>

</template>
