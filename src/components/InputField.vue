<template>
  <q-input
    class="q-py-md q-mb-lg"
    color="green"
    @input="updateModelValue"
    :value="value"
    :label="label"
    :type="type"
  >
    <template v-slot:prepend>
      <q-icon color="green-4" :name="iconName" /> </template
  ></q-input>
</template>

<script setup>
const props = defineProps([
  "color",
  "type",
  "inputClass",
  "value",
  "label",
  "iconName",
]);
const emit = defineEmits();

const updateModelValue = (event) => {
  emit("input", event.target.value);
};
</script>

<style></style>
