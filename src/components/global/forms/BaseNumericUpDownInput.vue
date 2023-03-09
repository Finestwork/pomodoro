<template>
  <div class="modal__text-input-groups">
    <p class="form-group__lbl">{{ label }}:</p>
    <BaseNumberTextInput :placeholder="placeholder" @input="onInput" v-model="inputValue" />
  </div>
</template>

<script>
import BaseNumberTextInput from '@/components/global/forms/BaseNumberTextInput.vue';

export default {
  components: {
    BaseNumberTextInput
  },
  props: {
    modelValue: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inputValue: this.modelValue
    };
  },
  emits: ['update:modelValue'],
  methods: {
    onInput() {
      this.$emit('update:modelValue', this.inputValue);
    }
  }
};
</script>
