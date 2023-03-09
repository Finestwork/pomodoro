<template>
  <p :class="getRootClass">
    <span class="alert__leading-icon" v-if="canShowLeadingIcon">
      <slot name="leadingIcon"></slot>
    </span>
    <span class="alert__msg">
      <slot></slot>
    </span>
    <span class="alert__trailing-icon" v-if="canShowLeadingIcon">
      <slot name="trailingIcon"></slot>
    </span>
  </p>
</template>

<script>
export default {
  props: {
    // primary, danger, success
    colorScheme: {
      type: String,
      required: true
    }
  },
  computed: {
    getRootClass() {
      return `single-line-alert alert--${this.colorScheme}`;
    },
    canShowLeadingIcon() {
      return !!this.$slots.leadingIcon;
    },
    canShowTrailingIcon() {
      return !!this.$slots.trailingIcon;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/1-settings/css-properties/colors/safety';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';

.single-line-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  padding: pixels.toRem(10);

  .alert {
    &__msg {
      font-weight: 600;
      color: white;
      font-size: pixels.toRem(map.get(major-second.$scale, 3));
    }

    &__leading-icon {
      margin-right: pixels.toRem(7);
    }

    &__trailing-icon {
      margin-left: pixels.toRem(7);
    }

    &__leading-icon,
    &__trailing-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      :deep(svg) {
        display: block;
        width: 100%;
        height: 100%;
        path {
          fill: white;
        }
      }
    }
  }

  &.alert--primary {
    background-color: map.get(main.$primary, 600);
  }

  &.alert--success {
    background-color: darken(map.get(safety.$success, 500), 3%);
  }

  &.alert--danger {
    background-color: lighten(map.get(safety.$danger, 500), 5%);
  }
}
</style>
