<template>
  <div :class="getRootClass">
    <VTooltip>
      <button class="control__play" type="button" @click="togglePlay" ref="button">
        <PlayIcon v-if="!isPlaying" />
        <PauseIcon v-if="isPlaying" />
      </button>

      <template #popper>{{ isPlaying ? 'Pause' : 'Play' }}</template>
    </VTooltip>

    <VTooltip>
      <button class="control__next" type="button" @click="nextSession">
        <ForwardIcon />
      </button>

      <template #popper>{{ getNextState }}</template>
    </VTooltip>
  </div>
</template>

<script>
import PlayIcon from '@/components/icons/Play.vue';
import PauseIcon from '@/components/icons/Pause.vue';
import ForwardIcon from '@/components/icons/Forward.vue';

// NPM
import AnimationHelper from '@/assets/js/helpers/animation-helper';

export default {
  components: {
    PlayIcon,
    PauseIcon,
    ForwardIcon
  },
  props: {
    // focus, short break, long break
    currentColorState: {
      type: String,
      required: true
    },
    isPlaying: {
      type: Boolean,
      required: true
    },
    nextState: {
      type: String,
      required: true
    }
  },
  emits: ['onTogglePlay', 'nextSession'],
  methods: {
    togglePlay(e) {
      AnimationHelper.bounce(e.currentTarget);
      this.$emit('onTogglePlay');
    },
    nextSession(e) {
      AnimationHelper.bounce(e.currentTarget);
      this.$emit('nextSession');
    }
  },
  computed: {
    getRootClass() {
      return `pomodoro-controls ${this.currentColorState}`;
    },
    getNextState() {
      const FORMATTED_WORD = this.nextState
        .split(' ')
        .map((word) => {
          return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
        })
        .join(' ');

      return `Next Session: ${FORMATTED_WORD}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/mixins/css-properties/width-and-height';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';

@mixin change-state($map) {
  .control__play {
    background-color: map.get($map, play);
    box-shadow: 0 8px 0 rgba(map.get($map, play), 0.6);

    &:focus,
    &:hover {
      background-color: map.get($map, hoverPlay);
    }

    :deep(svg) path {
      fill: map.get($map, playIcon);
    }
  }

  .control__next {
    background-color: map.get($map, next);
    box-shadow: 0 8px 0 rgba(map.get($map, next), 0.6);

    &:focus,
    &:hover {
      background-color: map.get($map, hoverNext);
    }

    :deep(svg) path {
      fill: map.get($map, nextIcon);
    }
  }
}

// prettier-ignore
.pomodoro-controls {
  display: flex;
  align-items: center;

  .control__play,
  .control__next {
    outline: none;
    display: flex;
    cursor: pointer;
    border: none;
    transition: background-color .15s ease;
    @include padding.all-sides((
        xsm: 15
    ));
    @include width-and-height.set((
        xsm: (width: 80px, height: 50px),
        lg: (width: 90px, height: 70px)
    ));

    :deep(svg) {
      display: block;
      height: 100%;
      width: 100%;
    }
  }

  .control__play {
    border-radius: 10px;
    @include margin.right((
        xsm: 15
    ));
  }

  .control__next {
    border-radius: 10px;
  }

  /* States */
  &.focus {
    @include change-state((
        play: map.get(main.$primary, 300),
        playIcon: map.get(main.$primary, 900),
        hoverPlay: darken(map.get(main.$primary, 300), 5%),
        next: darken(map.get(main.$primary, 100), 3%),
        hoverNext: darken(map.get(main.$primary, 100), 6%),
        nextIcon: map.get(main.$primary, 600),
    ));
  }
  &.short-break {
    @include change-state((
        play: map.get(main.$secondary, 300),
        playIcon: map.get(main.$secondary, 900),
        hoverPlay: darken(map.get(main.$secondary, 300), 5%),
        next: darken(map.get(main.$secondary, 100), 3%),
        hoverNext: darken(map.get(main.$secondary, 100), 6%),
        nextIcon: map.get(main.$secondary, 600),
    ));
  }
  &.long-break {
    @include change-state((
        play: map.get(main.$tertiary, 300),
        playIcon: map.get(main.$tertiary, 800),
        hoverPlay: darken(map.get(main.$tertiary, 300), 5%),
        next: darken(map.get(main.$tertiary, 200), 3%),
        hoverNext: darken(map.get(main.$tertiary, 200), 6%),
        nextIcon: map.get(main.$tertiary, 600),
    ));
  }
}
</style>
