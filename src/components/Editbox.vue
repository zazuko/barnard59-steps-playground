<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  format: {
    required: true,
    default: 'text/turtle',
    type: String
  },
  content: String,
  id: String,
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

function onParsingFailed (e) {
  parseError.value = e?.detail?.error
}

function onPrefixesParsed (e) {
  emit('onPrefixesParsed', {
    id: props.id,
    detail: e.detail,
  })
}

function onQuadsChanged (e) {
  parseError.value = null
  emit('onQuadsChanged', {
    id: props.id,
    detail: e.detail,
  })
}

defineExpose({
  quads: quads,
  setQuads
})

</script>

<template>
  <div class="rdfBox">
    <h3>{{ title }}</h3>
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

.rdfBox {
  border: lightgray solid;
  border-radius: 5px;
}
</style>
