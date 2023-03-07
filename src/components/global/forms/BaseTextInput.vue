<template>
  <div class="text-input">
    <label :for="id">{{ label }}</label>
    <div :class="inputWrapperClass">
      <input
        ref="input"
        :placeholder="placeholder"
        :type="type"
        :id="id"
        @input="onInput"
        :value="modelValue"
      />
      <span class="text-input__leading-icon" v-if="canShowLeadingIcon">
        <slot name="leadingIcon"></slot>
      </span>
      <span class="text-input__trailing-icon" v-if="canShowTrailingIcon">
        <slot name="trailingIcon"></slot>
      </span>
      <button
        class="text-input__clear-btn"
        type="button"
        @click="clearField"
        v-if="canShowClearBtn"
      >
        <XMarkIcon />
      </button>
    </div>
  </div>
</template>

<script>
import XMarkIcon from '@/components/icons/XMark.vue';

export default {
  components: { XMarkIcon },
  props: {
    modelValue: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onInput() {
      this.$emit('update:modelValue', this.$refs.input.value);
    },
    clearField() {
      this.$refs.input.value = '';
      this.$emit('update:modelValue', this.$refs.input.value);
    }
  },
  computed: {
    inputWrapperClass() {
      let base = 'text-input__wrapper';

      if (this.canShowLeadingIcon) base += ' add-leading-icon';
      if (this.canShowTrailingIcon) base += ' add-trailing-icon';

      return base;
    },
    canShowLeadingIcon() {
      return !!this.$slots.leadingIcon;
    },
    canShowTrailingIcon() {
      if (this.clearable) return this.modelValue === '';

      return false;
    },
    canShowClearBtn() {
      return this.modelValue !== '' && this.clearable;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/1-settings/css-properties/colors/text';
@use '../../../assets/scss/1-settings/css-properties/box-shadow/transition' as box-shadow-transition;
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';
@use '../../../assets/scss/2-tools/mixins/forms/text-input-fields';
@use '../../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;

$icon-offset: 12;
$icon-size: 12;
$default-padding: 10;

.text-input {
  @include text-input-fields.list {
    width: 100%;
    border: none;
    outline: none;
    font-weight: 600;
    border-radius: 7px;
    transition: box-shadow-transition.$transition-linear;
    color: map.get(text.$main, 900);
    font-size: pixels.toRem(map.get(major-second.$scale, 3));
    padding: pixels.toRem(14) pixels.toRem($default-padding);
    background-color: map.get(text.$main, 100);
    &:focus,
    &:hover {
      background-color: map.get(main.$primary, 100);
    }
    &:focus {
      @include box-shadow-primary.lightness(light, 'md');
    }
  }

  &__wrapper {
    position: relative;
    &.add-leading-icon {
      @include text-input-fields.list {
        padding-left: pixels.toRem($icon-size + $icon-offset + 5);
      }
    }
    &.add-trailing-icon {
      @include text-input-fields.list {
        padding-right: pixels.toRem($icon-size + $icon-offset + 5);
      }
    }
  }

  label {
    display: inline-block;
    cursor: pointer;
    font-weight: 600;
    color: map.get(text.$main, 900);
    margin-bottom: pixels.toRem(5);
  }

  &__clear-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    outline: none;
    transition: box-shadow-transition.$transition-linear;
    background-color: map.get(text.$main, 500);
    padding: pixels.toRem(3);
    &:focus,
    &:hover {
      background-color: map.get(main.$primary, 500);
    }
    &:focus {
      @include box-shadow-primary.lightness(lighter, md);
    }
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
      path {
        fill: white;
      }
    }
  }

  &__leading-icon,
  &__trailing-icon {
    display: flex;
    width: #{$icon-size}px;
    height: #{$icon-size}px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
      fill: map.get(text.$main, 800);
    }
  }

  &__leading-icon {
    left: #{$icon-offset}px;
  }

  &__trailing-icon {
    right: #{$icon-offset}px;
  }
}
</style>
