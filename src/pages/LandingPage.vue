<template>
  <main>
    <div class="home">
      <div class="home__left">
        <img
          class="home__bg"
          src="/images/background/authentication.png"
          alt="Gradient background"
        />
        <div class="home__slogan">
          <h1 class="home__slogan-title">
            One task at a <span class="home__slogan-sub-title">time</span>
          </h1>
          <p class="home__slogan-msg">
            Stay on task and crush your goals with PomoFocus - your trusty productivity companion
          </p>
        </div>
      </div>
      <div class="home__right">
        <Transition
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @before-leave="onBeforeLeave"
          @leave="onLeave"
        >
          <Component :is="getRoute" />
        </Transition>
      </div>
    </div>
  </main>
</template>

<script>
import TheLogin from '@/components/single-instance/TheLogin.vue';
import TheSignup from '@/components/single-instance/TheSignup.vue';
import anime from 'animejs';

const routes = {
  '/login': TheLogin,
  '/signup': TheSignup
};
export default {
  components: {
    TheLogin
  },
  data() {
    return {
      beforeEnterLeft: 0,
      beforeEnterTop: 0,
      beforeEnterWidth: 0,
      beforeEnterHeight: 0
    };
  },
  methods: {
    onBeforeLeave(el) {
      const { height, width, top } = el.getBoundingClientRect();
      const left = el.offsetLeft;

      Object.assign(el.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      });
    },

    onLeave(el, done) {
      anime({
        targets: el,
        left: '-100%',
        duration: 450,
        easing: 'easeOutExpo',
        complete: done
      });
    },

    onBeforeEnter(el) {
      Object.assign(el.style, {
        opacity: 0
      });
    },

    onEnter(el, done) {
      const { height, width, top } = el.getBoundingClientRect();
      const left = el.offsetLeft;

      Object.assign(el.style, {
        position: 'absolute',
        top: `${top}px`,
        left: `${el.parentElement.offsetWidth}px`,
        width: `${width}px`,
        height: `${height}px`,
        opacity: 1
      });

      anime({
        targets: el,
        left: `${left}px`,
        duration: 450,
        easing: 'easeOutExpo',
        complete: () => {
          done();
          el.style = null;
        }
      });
    }
  },
  computed: {
    getRoute() {
      const PATH_NAME = this.$route.path;
      return routes[PATH_NAME];
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../assets/scss/1-settings/css-properties/colors/main';
@use '../assets/scss/1-settings/css-properties/font-size/major-second';
@use '../assets/scss/2-tools/mixins/css-properties/font-size';
@use '../assets/scss/2-tools/mixins/css-properties/padding';
@use '../assets/scss/2-tools/mixins/css-properties/margin';
@use '../assets/scss/2-tools/mixins/css-properties/display';
@use '../assets/scss/2-tools/mixins/css-properties/width-and-height';

// prettier-ignore
.home {
  display: flex;
  height: 100vh;
  overflow: hidden;

  &__bg {
    width: 100%;
  }

  &__slogan {
    position: absolute;
    width: 80%;
    color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &-title {
      border-radius: 15px;
      overflow: hidden;
      position: relative;
      font-weight: 900;
      text-transform: uppercase;
      z-index: 1;
      @include padding.all-sides((
          xsm: [20, 10]
      ));
      @include font-size.responsive((
          xsm: map.get(major-second.$scale, 9)
      ));

      &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        backdrop-filter: blur(150px);
        z-index: -1;
      }
    }

    &-sub-title {
      color: map.get(main.$primary, 600);
      border-bottom: 2px dashed map.get(main.$primary, 500);
    }

    &-msg {
      @include margin.top((
          xsm: 15
      ));
    }
  }

  &__left,
  &__right {
    height: 100%;
  }

  &__left {
    position: relative;
    background: linear-gradient(40deg, map.get(main.$primary, 500) 10%, map.get(main.$primary, 200));
    @include display.set((
        xsm: none,
        lg: block
    ));
    @include width-and-height.set((
        xsm: (width: 50%)
    ));
  }

  &__right {
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    position: relative;
    @include width-and-height.set((
        xsm: (width: 100%, maxWidth: 450px),
        lg: (width: 50%, maxWidth: unset)
    ));
    @include padding.vertical((
        xsm: 25
    ));
    @include padding.horizontal((
        xsm: 25
    ));
  }
}
</style>
