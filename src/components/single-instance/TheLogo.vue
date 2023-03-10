<template>
  <div :class="getRootClass">
    <span class="logo__box">
      <PomoBuddyLogo />
    </span>
    <span class="logo__text">Pomofocus</span>
  </div>
</template>

<script>
import PomoBuddyLogo from '@/components/icons/PomoBuddyLogo.vue';
export default {
  components: {
    PomoBuddyLogo
  },
  props: {
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  computed: {
    getRootClass() {
      return `logo ${this.colorState}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/functions/convertions/pixels';

.logo {
  display: flex;
  align-items: center;
  &__box {
    display: flex;
    width: 20px;
    height: 20px;
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
      path {
        transition: fill 0.15s ease-in-out;
      }
    }
  }
  &__text {
    font-weight: 700;
    color: map.get(main.$primary, 600);
    margin-left: pixels.toRem(4);
    transition: color 0.15s ease-in-out;
  }

  /* States */
  &.focus {
    .logo__text {
      color: map.get(main.$primary, 600);
    }
    :deep(svg path) {
      fill: map.get(main.$primary, 500);
    }
  }
  &.short-break {
    .logo__text {
      color: map.get(main.$secondary, 600);
    }
    :deep(svg path) {
      fill: map.get(main.$secondary, 500);
    }
  }
  &.long-break {
    .logo__text {
      color: map.get(main.$tertiary, 600);
    }
    :deep(svg path) {
      fill: map.get(main.$tertiary, 500);
    }
  }
}
</style>
