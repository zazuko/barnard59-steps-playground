<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  format: {
    required: true,
    default: 'text/turtle',
    type: String
  },
  quads: Array,
  title: String
})

const parseError = ref()
const rdfEditor = ref()

onMounted(async () => {
  const instance = rdfEditor.value
  await instance.ready
})

function onParsingFailed (e) {
  parseError.value = e?.detail?.error
}

</script>

<template>
  <div class="rdfBox">
    <h4>{{ title }}</h4>
    <rdf-editor
        :quads="quads"
        ref="rdfEditor"
        :format="format"
        auto-parse
        class="w-full h-full overflow-hidden"
        parseDelay="1000"
        prefixes="schema"
        @parsing-failed="onParsingFailed"
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
