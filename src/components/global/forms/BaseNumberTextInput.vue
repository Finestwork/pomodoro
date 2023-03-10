<template>
  <div :class="getRootClass">
    <input ref="input" type="number" :placeholder="placeholder" :value="value" />
    <button type="button" class="number-text-input__btn-controls-up" @click="increment">
      <CaretUp />
    </button>
    <button type="button" class="number-text-input__btn-controls-down" @click="decrement">
      <CaretDown />
    </button>
  </div>
</template>

<script>
import CaretDown from '@/components/icons/CaretDown.vue';
import CaretUp from '@/components/icons/CaretUp.vue';

export default {
  components: {
    CaretUp,
    CaretDown
  },
  props: {
    placeholder: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  methods: {
    increment() {
      const CURRENT_VALUE = this.$refs.input.value;
      this.$refs.input.value = (
        CURRENT_VALUE.trim() === '' ? 1 : parseFloat(CURRENT_VALUE) + 1
      ).toString();
    },
    decrement() {
      const CURRENT_VALUE = this.$refs.input.value;
      this.$refs.input.value = (
        CURRENT_VALUE.trim() === ''
          ? 0
          : parseFloat(CURRENT_VALUE) <= 0
          ? 0
          : parseFloat(CURRENT_VALUE) - 1
      ).toString();
    }
  },
  computed: {
    getRootClass() {
      return `number-text-input ${this.colorState}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/1-settings/css-properties/colors/text';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';

// prettier-ignore
.number-text-input {
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  input[type='number'] {
    outline: none;
    border: none;
    width: 100%;
    font-weight: 600;
    color: map.get(text.$main, 900);
    background-color: map.get(text.$main, 100);
    font-size: pixels.toRem(map.get(major-second.$scale, 3));
    padding: pixels.toRem(10) pixels.toRem(25) pixels.toRem(10) pixels.toRem(10);
    &:focus{
      outline: none;
    }
  }
  &__btn-controls-up,
  &__btn-controls-down{
    position: absolute;
    right: 0;
    width: 25px;
    height: 50%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    transition: all .15s ease;
    outline: none;
    :deep(svg){
      display: block;
      width: 100%;
      height: 100%;
      path{
        fill: map.get(text.$main, 900);
      }
    }
    padding-top: pixels.toRem(3);
    padding-bottom: pixels.toRem(3);
  }
  &__btn-controls-up{
    top: 0;
  }
  &__btn-controls-down{
    bottom: 0;
  }

  /* States */
  &.focus{
    input[type='number'] {
      &:focus,
      &:hover{
        background-color: map.get(main.$primary, 100)
      }
    }

    .number-text-input__btn-controls-up,
    .number-text-input__btn-controls-down{
      &:focus,
      &:hover{
        background-color: map.get(main.$primary, 100);
        :deep(svg path){
          fill: map.get(main.$primary, 600);
        }
      }
    }
  }

  &.short-break{
    input[type='number'] {
      &:focus,
      &:hover{
        background-color: map.get(main.$secondary, 100)
      }
    }

    .number-text-input__btn-controls-up,
    .number-text-input__btn-controls-down{
      &:focus,
      &:hover{
        background-color: map.get(main.$secondary, 100);
        :deep(svg path){
          fill: map.get(main.$secondary, 600);
        }
      }
    }
  }
  &.long-break{
    input[type='number'] {
      &:focus,
      &:hover{
        background-color: map.get(main.$tertiary, 100)
      }
    }

    .number-text-input__btn-controls-up,
    .number-text-input__btn-controls-down{
      &:focus,
      &:hover{
        background-color: map.get(main.$tertiary, 100);
        :deep(svg path){
          fill: map.get(main.$tertiary, 600);
        }
      }
    }
  }
}
</style>
