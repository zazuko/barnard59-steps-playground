<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  format: {
    required: true,
    default: 'text/turtle',
    type: String
  },
  content: String,
  index: Number,
  title: String
})

const emit = defineEmits(['onQuadsChanged', 'onPrefixesParsed'])
const parseError = ref()
const rdfEditor = ref()
const quads = ref()

onMounted(async () => {
  const instance = rdfEditor.value
  await instance.ready
  instance.codeMirror.editor.on('change', (c, e) => {
    quads.value = instance.quads
  })
})

async function setQuads (quads) {
  const instance = rdfEditor.value
  await instance.ready
  instance.quads = quads
}

async function getQuads () {
  const instance = rdfEditor.value
  await instance.ready
  return instance.quads
}

function onParsingFailed (e) {
  parseError.value = e?.detail?.error
}

function onPrefixesParsed (e) {
  emit('onPrefixesParsed', {
    index: props.index,
    detail: e.detail,
  })
}

function onQuadsChanged (e) {
  parseError.value = null
  emit('onQuadsChanged', {
    index: props.index,
    detail: e.detail,
  })
}

defineExpose({
  getQuads,
  setQuads
})

</script>

<template>
  <div class="rdfBox">
    <h4>{{ title }}</h4>
    <rdf-editor
        ref="rdfEditor"
        :format="format"
        :value.prop="content"
        auto-parse
        class="w-full h-full overflow-hidden"
        parseDelay="1000"
        prefixes="schema"
        @parsing-failed="onParsingFailed"
        @quads-changed="onQuadsChanged"
        @prefixes-parsed="onPrefixesParsed"
    />
    <div v-if="parseError">
      {{ parseError }}
    </div>
  </div>
</template>
<style>

h3 {
  color: gray;
}

.rdfBox {
  border: lightgray solid;
  border-radius: 5px;
}
</style>
