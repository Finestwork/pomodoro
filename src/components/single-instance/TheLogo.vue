<template>
  <div :class="getRootClass">
    <span class="logo__box">
      <PomoBuddyLogo />
    </span>
    <span class="logo__text">PomoTasker</span>
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
      fill: map.get(main.$primary, 600);
    }
  }
  &.short-break {
    .logo__text {
      color: map.get(main.$secondary, 600);
    }
    :deep(svg path) {
      fill: map.get(main.$secondary, 600);
    }
  }
  &.long-break {
    .logo__text {
      color: map.get(main.$tertiary, 600);
    }
    :deep(svg path) {
      fill: map.get(main.$tertiary, 600);
    }
  }
}

.dark {
  .logo {
    &.focus {
      .logo__text {
        color: darken(map.get(main.$primary, 800), 2%);
      }
      :deep(svg path) {
        fill: darken(map.get(main.$primary, 800), 2%);
      }
    }
    &.short-break {
      .logo__text {
        color: map.get(main.$secondary, 800);
      }
      :deep(svg path) {
        fill: map.get(main.$secondary, 800);
      }
    }
    &.long-break {
      .logo__text {
        color: map.get(main.$tertiary, 800);
      }
      :deep(svg path) {
        fill: map.get(main.$tertiary, 800);
      }
    }
  }
}
</style>
