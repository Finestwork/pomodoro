<template>
  <div :class="getRootClass" ref="root">
    <span class="modal__bg" ref="bg"></span>
    <div class="modal__outer-container">
      <div class="modal__container" ref="container">
        <div class="modal__header" v-if="canShowHeader">
          <h2 class="modal__title">{{ headerTitle }}</h2>
          <button class="modal__close-btn" type="button" @click="onModalClose" v-if="hasCloseBtn">
            <XMarkIcon />
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';
import XMarkIcon from '@/components/icons/XMark.vue';

export default {
  components: {
    XMarkIcon
  },
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    // focus, short-break, long-break
    colorState: {
      type: String,
      required: true
    },
    headerTitle: {
      type: String,
      default: ''
    },
    hasCloseBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      focusableElements: 'button, input, a, textarea, select, iframe, object, embed, area, label',
      focusableContents: null,
      firstFocusableElement: null,
      lastFocusableElement: null
    };
  },
  mounted() {
    this.focusableContents = Array.from(
      this.$refs.root.querySelectorAll(this.focusableElements)
    ).filter((el) => {
      return el.getAttribute('tabindex') !== '-1';
    });
    this.firstFocusableElement = this.focusableContents[0];
    this.lastFocusableElement = this.focusableContents[this.focusableContents.length - 1];

    window.addEventListener('keydown', this.tabTrapping);
  },
  unmounted() {
    window.removeEventListener('keydown', this.tabTrapping);
  },
  emits: ['modalShown', 'modalHidden', 'onModalClose'],
  methods: {
    onModalClose() {
      this.$emit('onModalClose');
    },
    tabTrapping(e) {
      if (!this.showModal) return;
      if (e.code.toLowerCase() !== 'tab') return;

      const ACTIVE_EL = document.activeElement;
      // If user presses shift key + tab
      if (e.shiftKey) {
        if (ACTIVE_EL === this.firstFocusableElement) {
          this.lastFocusableElement.focus();
          e.preventDefault(); // prevent browser default focus behavior
        }
      } else {
        if (ACTIVE_EL === this.lastFocusableElement) {
          this.firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  },
  computed: {
    getRootClass() {
      return `modal ${this.colorState}`;
    },
    canShowHeader() {
      return this.headerTitle !== '' || this.hasCloseBtn;
    }
  },
  watch: {
    showModal: {
      handler(showModal) {
        if (showModal) {
          if (!this.$refs.root) return;

          this.$refs.root.style.display = 'block';

          Object.assign(this.$refs.bg.style, {
            opacity: 0
          });

          Object.assign(this.$refs.container.style, {
            opacity: 0,
            transform: `scale(0)`
          });

          document.activeElement.blur();
          this.firstFocusableElement.focus();

          anime({
            targets: this.$refs.bg,
            duration: 350,
            easing: 'easeOutQuint',
            opacity: 0.85
          });
          anime({
            targets: this.$refs.container,
            duration: 350,
            easing: 'easeOutQuint',
            scale: 1,
            opacity: 1,
            complete: () => this.$emit('modalShown')
          });
        } else {
          anime({
            targets: this.$refs.bg,
            duration: 350,
            easing: 'easeOutQuint',
            opacity: 0
          });

          anime({
            targets: this.$refs.container,
            duration: 350,
            easing: 'easeOutQuint',
            scale: 0,
            opacity: 0,
            complete: () => {
              if (this.$refs.root) this.$refs.root.style.display = null;
              this.$emit('modalHidden');
            }
          });
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/1-settings/css-properties/colors/text';
@use '../../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../../assets/scss/1-settings/css-properties/box-shadow/transition' as box-shadow-transition;
@use '../../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';
@use '../../assets/scss/2-tools/mixins/css-properties/box-shadow/primary' as box-shadow-primary;
@use '../../assets/scss/2-tools/mixins/css-properties/box-shadow/secondary' as box-shadow-secondary;
@use '../../assets/scss/2-tools/mixins/css-properties/box-shadow/tertiary' as box-shadow-tertiary;

// prettier-ignore
.modal {
  display: none;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 999;

  &__bg {
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
  }

  &__outer-container {
    overflow-y: scroll;
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__container {
    background-color: white;
    border-radius: 15px;
    margin: auto;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-weight: 600;
    color: map.get(text.$main, 900);
    @include font-size.responsive((
        xsm: map.get(major-second.$scale, 6)
    ));
  }

  &__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    width: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: box-shadow-transition.$transition-linear;
    @include padding.all-sides((
        xsm: 3
    ));

    &:focus {
      outline: none;
    }


    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;

      path {
        fill: map.get(text.$main, 900);
      }
    }
  }

  /* States */
  &.focus {
    .modal__bg {
      background-color: map.get(main.$primary, 900);
    }

    .modal__close-btn {
      &:focus {
        @include box-shadow-primary.lightness(lighter, md)
      }

      &:focus,
      &:hover {
        background-color: map.get(main.$primary, 100);

        :deep(svg path) {
          fill: map.get(main.$primary, 600);
        }
      }
    }
  }

  &.short-break {
    .modal__bg {
      background-color: map.get(main.$secondary, 900);
    }

    .modal__close-btn {
      &:focus {
        @include box-shadow-secondary.lightness(light, md)
      }

      &:focus,
      &:hover {
        background-color: map.get(main.$secondary, 100);

        :deep(svg path) {
          fill: map.get(main.$secondary, 600);

        }
      }
    }
  }

  &.long-break {
    .modal__bg {
      background-color: map.get(main.$tertiary, 900);
    }

    .modal__close-btn {
      &:focus {
        @include box-shadow-tertiary.lightness(lighter, md)
      }

      &:focus,
      &:hover {
        background-color: map.get(main.$tertiary, 100);

        :deep(svg path) {
          fill: map.get(main.$tertiary, 600);
        }
      }
    }
  }
}
</style>
