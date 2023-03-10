<template>
  <div :class="getRootClass">
    <div class="text-input__label-wrapper">
      <p class="text-input__label">{{ label }}:</p>
      <VTooltip popper-class="btn-tooltip" :triggers="['focus', 'hover', 'click']">
        <button class="text-input__info-btn" type="button">
          <Question />
        </button>
        <template #popper>{{ popMsg }}</template>
      </VTooltip>
    </div>
    <BaseNumberTextInput
      ref="input"
      :placeholder="placeholder"
      :value="value"
      :color-state="colorState"
    />
  </div>
</template>

<script>
import BaseNumberTextInput from '@/components/global/forms/BaseNumberTextInput.vue';
import Question from '@/components/icons/Question.vue';

export default {
  components: {
    BaseNumberTextInput,
    Question
  },
  props: {
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    popMsg: {
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
  computed: {
    getRootClass() {
      return `text-input-groups ${this.colorState}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../../assets/scss/2-tools/mixins/css-properties/all-properties';

// prettier-ignore
.text-input-groups {
  @include all-properties.init((
      xsm: (
          display: flex,
          flex-direction: column
      ),
      500: (
          flex-direction: row,
          justify-content: space-between,
          align-items: center
      )
  ));

  .text-input__label-wrapper {
    display: flex;
    align-items: center;
    @include margin.bottom((
        xsm: 10,
        500: 0
    ));
  }

  .text-input__label {
    font-weight: 600;
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 3)
    ));
    @include margin.right((
        xsm: 7
    ));
  }

  .text-input__info-btn {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    cursor: pointer;
    outline: none;
    @include padding.all-sides((
        xsm: 3
    ));

    &:focus,
    &:hover {
      background-color: map.get(main.$primary, 900);
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

  /* States */
  &.focus{
    .text-input__label {
      color: map.get(main.$primary, 900);
    }
    .text-input__info-btn {
      background-color: lighten(map.get(main.$primary, 500), 5%);
      border: 2px solid darken(map.get(main.$primary, 500), 5%);
      &:focus,
      &:hover {
        background-color: map.get(main.$primary, 500);
      }
    }
  }
  &.short-break{
    .text-input__label {
      color: map.get(main.$secondary, 900);
    }
    .text-input__info-btn {
      background-color: lighten(map.get(main.$secondary, 600), 5%);
      border: 2px solid darken(map.get(main.$secondary, 600), 5%);
      &:focus,
      &:hover {
        background-color: map.get(main.$secondary, 600);
      }
    }
  }
  &.long-break{
    .text-input__label {
      color: map.get(main.$tertiary, 800);
    }
    .text-input__info-btn {
      background-color: lighten(map.get(main.$tertiary, 500), 5%);
      border: 2px solid darken(map.get(main.$tertiary, 500), 5%);
      &:focus,
      &:hover {
        background-color: map.get(main.$tertiary, 500);
      }
    }
  }
}
</style>
