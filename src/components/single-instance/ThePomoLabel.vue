<template>
  <TransitionGroup name="list" tag="div" class="pomo">
    <div class="pomo-label pomo-focus" v-if="shouldDisplayFire">
      <span class="label__icon"><FireIcon /></span>
      <span class="label__text">Be Productive</span>
    </div>
    <div class="pomo-label pomo-short-break" v-else-if="shouldDisplayShortBreak">
      <span class="label__icon"><MugHotIcon /></span>
      <span class="label__text">Short Break</span>
    </div>
    <div class="pomo-label pomo-long-break" v-else-if="shouldDisplayLongBreak">
      <span class="label__icon"><SnoozeIcon /></span>
      <span class="label__text">Long Break</span>
    </div>
  </TransitionGroup>
</template>

<script>
import FireIcon from '@/components/icons/Fire.vue';
import MugHotIcon from '@/components/icons/MugHot.vue';
import SnoozeIcon from '@/components/icons/Snooze.vue';

export default {
  props: {
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    }
  },
  components: {
    FireIcon,
    MugHotIcon,
    SnoozeIcon
  },
  computed: {
    shouldDisplayFire() {
      return this.colorState === 'focus';
    },
    shouldDisplayShortBreak() {
      return this.colorState === 'short-break';
    },
    shouldDisplayLongBreak() {
      return this.colorState === 'long-break';
    }
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
.pomo{
  perspective: 999px;
  transform-style: preserve-3d;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &-label{
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
        flex-shrink: 0;
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

      &__text {
        font-weight: 600;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        @include font-size.responsive((
            xsm: map.get(major-second.$scale, 4)
        ));
      }
    }

    @mixin color-states($map) {
      background-color: map.get($map, bg);
      border: 4px solid map.get($map, border);

      .label__icon {
        :deep(svg) {
          path {
            fill: map.get($map, fill);
          }
        }
      }

      .label__text {
        color: map.get($map, color);
      }
    }

    &.pomo-focus {
      @include color-states((
          bg: map.get(main.$primary, 100),
          border: map.get(main.$primary, 500),
          fill: map.get(main.$primary, 500),
          color: map.get(main.$primary, 500)
      ));
    }

    &.pomo-short-break {
      @include color-states((
          bg: map.get(main.$secondary, 100),
          border: map.get(main.$secondary, 500),
          fill: map.get(main.$secondary, 500),
          color: map.get(main.$secondary, 500)
      ));
    }

    &.pomo-long-break {
      @include color-states((
          bg: map.get(main.$tertiary, 100),
          border: map.get(main.$tertiary, 500),
          fill: map.get(main.$tertiary, 500),
          color: map.get(main.$tertiary, 500)
      ));
    }
  }
}

.move,
.list-enter-active,
.list-leave-active {
  transition: all 0.15s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-enter-from {
  transform: translateY(10px);
}

.list-leave-to {
  transform: translateY(-10px);
}

.list-leave-active {
  position: absolute;
}
</style>
