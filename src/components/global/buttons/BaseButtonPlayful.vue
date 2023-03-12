<template>
  <button :class="getRootClass" :type="type" :disabled="isLoading">
    <span class="btn__main-content" v-if="!isLoading">
      <span class="btn__leading-icon" v-if="canDisplayLeadingIcon">
        <slot name="leadingIcon"></slot>
      </span>
      <span class="btn__text" v-if="canDisplayText">
        <slot name="text"></slot>
      </span>
      <span class="btn__trailing-icon" v-if="canDisplayTrailingIcon">
        <slot name="trailingIcon"></slot>
      </span>
    </span>
    <span class="btn__loader-content" v-if="isLoading">
      <span class="loader__animation-wrapper" ref="lottieWrapper"></span>
      <span class="loader__text">{{ loaderText }}</span>
    </span>
  </button>
</template>

<script>
import lottie from 'lottie-web';
import CircleAnimation from '@/assets/js/lottie/circle.json';

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean
    },
    loaderText: {
      type: String,
      default: 'Loading'
    },
    // focus, short-break, long-break, danger
    colorState: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      lottie: null
    };
  },
  watch: {
    isLoading: {
      handler(isLoading) {
        if (isLoading) {
          this.$nextTick(() => {
            this.lottie = lottie.loadAnimation({
              container: this.$refs.lottieWrapper,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              animationData: CircleAnimation
            });
          });
        } else {
          if (this.lottie !== null) {
            this.lottie.destroy();
            this.lottie = null;
          }
        }
      },
      immediate: true
    }
  },
  computed: {
    getRootClass() {
      return `btn--playful ${this.colorState}`;
    },
    canDisplayLeadingIcon() {
      return !!this.$slots.leadingIcon;
    },
    canDisplayTrailingIcon() {
      return !!this.$slots.trailingIcon;
    },
    canDisplayText() {
      return !!this.$slots.text;
    }
  }
};
</script>

<style lang="scss">
@use 'sass:map';
@use '../../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../../assets/scss/1-settings/css-properties/colors/main';
@use '../../../assets/scss/1-settings/css-properties/colors/safety';
@use '../../../assets/scss/2-tools/functions/convertions/pixels';

.btn--playful {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  border-radius: 7px;
  transition: all 0.15s ease-in-out;
  padding: pixels.toRem(10);

  &:focus {
    outline: none;
    transform: translateY(3px);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: lighten(map.get(main.$primary, 500), 10%);
  }

  .btn {
    &__main-content {
      display: flex;
      align-items: center;
    }
    &__text {
      font-weight: 600;
      color: white;
      font-size: pixels.toRem(map.get(major-second.$scale, 3));
    }
    &__leading-icon,
    &__trailing-icon {
      width: 13px;
      height: 13px;
      :deep(svg) {
        display: block;
        width: 100%;
        height: 100%;
        path {
          fill: white;
        }
      }
    }
    &__leading-icon {
      margin-right: pixels.toRem(7);
    }
    &__trailing-icon {
      margin-left: pixels.toRem(7);
    }

    &__loader-content {
      display: flex;
      .loader {
        &__animation-wrapper {
          display: flex;
          width: 15px;
          height: 15px;
          margin-right: pixels.toRem(7);
          svg {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        &__text {
          font-weight: 600;
          color: white;
          font-size: pixels.toRem(map.get(major-second.$scale, 3));
        }
      }
    }
  }

  /* States */
  &.focus {
    box-shadow: 0 5px 0 rgba(map.get(main.$primary, 500), 0.5);
    background-color: map.get(main.$primary, 500);
    &:focus {
      box-shadow: 0 2px 0 rgba(map.get(main.$primary, 500), 0.5);
    }

    &:focus,
    &:hover {
      background-color: darken(map.get(main.$primary, 500), 3%);
    }

    &:disabled {
      background-color: lighten(map.get(main.$primary, 500), 10%);
    }
  }
  &.short-break {
    box-shadow: 0 5px 0 rgba(map.get(main.$secondary, 500), 0.5);
    background-color: map.get(main.$secondary, 500);
    &:focus {
      box-shadow: 0 2px 0 rgba(map.get(main.$secondary, 500), 0.5);
    }

    &:focus,
    &:hover {
      background-color: darken(map.get(main.$secondary, 500), 3%);
    }

    &:disabled {
      background-color: lighten(map.get(main.$secondary, 500), 10%);
    }
  }
  &.long-break {
    box-shadow: 0 5px 0 rgba(map.get(main.$tertiary, 500), 0.5);
    background-color: map.get(main.$tertiary, 500);
    &:focus {
      box-shadow: 0 2px 0 rgba(map.get(main.$tertiary, 500), 0.5);
    }

    &:focus,
    &:hover {
      background-color: darken(map.get(main.$tertiary, 500), 3%);
    }

    &:disabled {
      background-color: lighten(map.get(main.$tertiary, 500), 10%);
    }
  }
  &.danger {
    $danger: lighten(map.get(safety.$danger, 500), 5%);

    box-shadow: 0 5px 0 rgba($danger, 0.5);
    background-color: $danger;
    &:focus {
      box-shadow: 0 2px 0 rgba($danger, 0.5);
    }

    &:focus,
    &:hover {
      background-color: darken($danger, 3%);
    }

    &:disabled {
      background-color: lighten($danger, 10%);
    }
  }
}
</style>
