<template>
  <div class="pomo-label pomo-fire">
    <span class="label__icon"><Fire /></span>
    <span class="label__text">Be Productive</span>
  </div>
</template>

<script>
import Fire from '@/components/icons/Fire.vue';

export default {
  components: {
    Fire
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/width-and-height';

// prettier-ignore
.pomo-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 99rem;
  @include padding.all-sides((
    xsm: 15
  ));

  .label {
    &__icon {
      display: flex;
      @include margin.right((
        xsm: 7
      ));
      @include width-and-height.set((
        xsm: (width: 13px, height: 13px)
      ));
      :deep(svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    &__text{
      font-weight: 600;
      @include font-size.responsive((
        xsm: map.get(major-second.$scale, 4)
      ));
    }
  }

  &.pomo-fire {
    background-color: map.get(main.$primary, 100);
    border: 4px solid map.get(main.$primary, 500);

    .label__icon {
      :deep(svg) {
        path {
          fill: map.get(main.$primary, 500);
        }
      }
    }
    .label__text {
      color: map.get(main.$primary, 500);
    }
  }
}
</style>
