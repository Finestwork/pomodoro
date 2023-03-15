<template>
  <VTooltip :popper-class="'btn-tooltip'">
    <button :class="getRootClass" type="button">
      <slot></slot>
    </button>

    <template #popper>{{ tooltip }}</template>
  </VTooltip>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  computed: {
    getRootClass() {
      return `btn-icon ${this.colorState}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;
@use '../../../assets/scss/2-tools/mixins/css-properties/box-shadow/secondary' as
  box-shadow-secondary;
@use '../../../assets/scss/2-tools/mixins/css-properties/box-shadow/tertiary' as box-shadow-tertiary;

// prettier-ignore
.btn-icon {
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all .15s ease-in-out;
  @include padding.all-sides((
    xsm: 9.5
  ));
  @include margin.right((
    xsm: 7
  ));
  &:focus{
    outline: none;
  }
  &:focus,
  &:hover{
    :deep(svg){
      path{
        fill: white;
      }
    }
  }

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
    fill: map.get(main.$primary, 500);
  }

  /* States */
  &.focus{
    background-color: map.get(main.$primary, 100);
    &:focus{
      @include box-shadow-primary.lightness(lightest, md);
    }

    &:focus,
    &:hover{
      background-color: map.get(main.$primary, 500);
    }
    :deep(svg) {
      fill: map.get(main.$primary, 500);
    }
  }

  &.short-break{
    background-color: map.get(main.$secondary, 100);
    &:focus{
      @include box-shadow-secondary.lightness(light, md);
    }

    &:focus,
    &:hover{
      background-color: map.get(main.$secondary, 500);
    }
    :deep(svg) {
      fill: map.get(main.$secondary, 500);
    }
  }

  &.long-break{
    background-color: map.get(main.$tertiary, 100);
    &:focus{
      @include box-shadow-tertiary.lightness(light, md);
    }

    &:focus,
    &:hover{
      background-color: map.get(main.$tertiary, 500);
    }
    :deep(svg) {
      fill: map.get(main.$tertiary, 500);
    }
  }
}

.dark {
  .btn-icon {
    &.focus {
      background-color: darken(map.get(main.$primary, 900), 2%);
      &:focus {
        @include box-shadow-primary.lightness(lighter, md);
      }

      &:focus,
      &:hover {
        background-color: lighten(map.get(main.$primary, 900), 5%);
        :deep(svg path) {
          fill: map.get(main.$primary, 600);
        }
      }

      :deep(svg) {
        fill: darken(map.get(main.$primary, 800), 2%);
      }
    }
    &.short-break {
      background-color: darken(map.get(main.$secondary, 900), 2%);
      &:focus {
        @include box-shadow-secondary.lightness(lighter, md);
      }

      &:focus,
      &:hover {
        background-color: lighten(map.get(main.$secondary, 900), 5%);
        :deep(svg path) {
          fill: map.get(main.$secondary, 600);
        }
      }

      :deep(svg) {
        fill: map.get(main.$secondary, 800);
      }
    }
    &.long-break {
      background-color: map.get(main.$tertiary, 900);
      &:focus {
        @include box-shadow-tertiary.lightness(lighter, md);
      }

      &:focus,
      &:hover {
        background-color: lighten(map.get(main.$tertiary, 900), 5%);
        :deep(svg path) {
          fill: map.get(main.$tertiary, 600);
        }
      }

      :deep(svg) {
        fill: map.get(main.$tertiary, 700);
      }
    }
  }
}
</style>
