<template>
  <VTooltip :popper-class="'btn-tooltip'">
    <button class="btn-icon" type="button">
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
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/1-settings/css-properties/box-shadow/transition' as box-shadow-transition;
@use '../../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;

// prettier-ignore
.btn-icon {
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: box-shadow-transition.$transition-linear;
  background-color: map.get(main.$primary, 100);
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
    background-color: map.get(main.$primary, 500);
    :deep(svg){
      fill: white;
    }
  }

  &:focus{
    @include box-shadow-primary.lightness(lightest, md);
  }

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
    fill: map.get(main.$primary, 500);
  }
}
</style>
