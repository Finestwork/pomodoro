<template>
  <div :class="getRootClass">
    <span class="timer__text" ref="timerText">24:35</span>
  </div>
</template>

<script>
import anime from 'animejs';

export default {
  props: {
    isPlaying: {
      type: Boolean,
      required: true
    },
    // initial, focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  watch: {
    isPlaying(isPlaying) {
      if (isPlaying) {
        const FONT_SETTINGS = {
          wght: 400
        };

        anime({
          targets: FONT_SETTINGS,
          wght: 900,
          round: 1,
          update: () => {
            Object.assign(this.$refs.timerText.style, {
              'font-variation-settings': `"wght" ${FONT_SETTINGS.wght}`
            });
          }
        });
      } else {
        const FONT_SETTINGS = {
          wght: 900
        };

        anime({
          targets: FONT_SETTINGS,
          wght: 400,
          round: 1,
          update: () => {
            Object.assign(this.$refs.timerText.style, {
              'font-variation-settings': `"wght" ${FONT_SETTINGS.wght}`
            });
          }
        });
      }
    }
  },
  computed: {
    getRootClass() {
      return `timer--text ${this.colorState}`;
    }
  }
};
</script>
<style lang="scss" scoped>
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/2-tools/mixins/css-properties/font-size';

// prettier-ignore
.timer--text {
  .timer {
    &__text {
      font-feature-settings: "kern";
      font-variation-settings: "wght" 900, "wdth" 110, "opsz" 14;
      @include font-size.responsive((
          xsm: 80,
          450: 150,
          lg: 300
      ));
    }
  }

  &.initial {
    color: darken(map.get(main.$primary, 900), 3%);
  }
}
</style>
