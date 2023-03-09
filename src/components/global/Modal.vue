<template>
  <div class="modal" ref="root">
    <span class="modal__bg" ref="bg"></span>
    <div class="modal__outer-container">
      <div class="modal__container" ref="container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import anime from 'animejs';
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    showModal: {
      handler(showModal) {
        if (showModal) {
          this.$refs.root.style.display = 'block';

          Object.assign(this.$refs.bg.style, {
            opacity: 0
          });

          Object.assign(this.$refs.container.style, {
            opacity: 0,
            transform: `scale(0)`
          });

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
            opacity: 1
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

// prettier-ignore
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  &__bg {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background-color: map.get(main.$primary, 900);
  }

  &__outer-container{
    position: absolute;
    width: 100%;
    overflow-y: scroll;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__container {
    background-color: white;
    border-radius: 15px;
  }
}
</style>
