<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  format: {
    required: true,
    default: 'text/turtle',
    type: String
  },
  quads: Array,
  title: String,
  hasToggle: {
    default: false
  }
})

const parseError = ref()

function onParsingFailed (e) {
  parseError.value = e?.detail?.error
}

const isOpen = ref(false)

</script>

<template>
  <template v-if="hasToggle">
    <h4 class="clickable" @click="isOpen=!isOpen">{{ title }}</h4>
    <rdf-editor v-if="isOpen"
        :format="format"
        :quads="quads"
        auto-parse
        class="w-full h-full overflow-hidden"
        parseDelay="1000"
        @parsing-failed="onParsingFailed"
    />
  </template>
  <template v-else>
    <div class="rdfBox">
      <h4>{{ title }}</h4>
      <rdf-editor
          :format="format"
          :quads="quads"
          prefixes="code"
          auto-parse
          class="w-full h-full overflow-hidden"
          parseDelay="1000"
          @parsing-failed="onParsingFailed"
      />
      <div v-if="parseError">
        {{ parseError }}
      </div>
    </div>
  </template>
</template>
<style>

.clickable {
  cursor: pointer;
}

h4 {
  color: gray;
}

.rdfBox {
  border: lightgray solid;
  border-radius: 5px;
}
</style>
