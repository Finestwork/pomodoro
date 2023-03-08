<template>
  <div :class="getRootClass">
    <VTooltip>
      <button class="control__play" type="button" @click="togglePlay">
        <PlayIcon v-if="!isPlaying" />
        <PauseIcon v-if="isPlaying" />
      </button>

      <template #popper>Play</template>
    </VTooltip>

    <VTooltip>
      <button class="control__next" type="button">
        <ForwardIcon />
      </button>

      <template #popper>Next</template>
    </VTooltip>
  </div>
</template>

<script>
import PlayIcon from '@/components/icons/Play.vue';
import PauseIcon from '@/components/icons/Pause.vue';
import ForwardIcon from '@/components/icons/Forward.vue';

export default {
  components: {
    PlayIcon,
    PauseIcon,
    ForwardIcon
  },
  props: {
    // initial, focus, short-break, long-break
    currentColorState: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPlaying: false
    };
  },
  emits: ['onTogglePlay'],
  methods: {
    togglePlay() {
      this.isPlaying = !this.isPlaying;
      this.$emit('onTogglePlay', this.isPlaying);
    }
  },
  computed: {
    getRootClass() {
      return `pomodoro-controls ${this.currentColorState}`;
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
  &.initial {
    @include change-state((
        play: map.get(main.$primary, 300),
        playIcon: map.get(main.$primary, 900),
        hoverPlay: darken(map.get(main.$primary, 300), 5%),
        next: darken(map.get(main.$primary, 100), 3%),
        hoverNext: darken(map.get(main.$primary, 100), 6%),
        nextIcon: map.get(main.$primary, 600),
    ));
  }
}
</style>
