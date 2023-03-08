<template>
  <div :class="getRootClass">
    <span class="timer__text">24:35</span>
  </div>
</template>

<script>
export default {
  props: {
    // initial, focus, short-break, long-break
    colorState: {
      type: String,
      required: true
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
.timer--text{
  .timer{
    &__text{
      font-feature-settings: "kern";
      font-variation-settings: "wght" 900, "wdth" 110, "opsz" 14;
      @include font-size.responsive((
        xsm: 300
      ));
    }
  }

  &.initial{
    color: darken(map.get(main.$primary, 900), 3%);
  }
}
</style>
