<template>
  <Modal :color-state="colorState" :show-modal="showModal" @onModalClose="onModalClose"> </Modal>
</template>

<script>
import Modal from '@/components/global/Modal.vue';

export default {
  components: {
    Modal
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    colorState: {
      type: String,
      required: true
    }
  },
  mounted() {},
  emits: ['onModalClose'],
  methods: {
    onModalClose() {
      this.$emit('onModalClose');
    }
  }
};
</script>
