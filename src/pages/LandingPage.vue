<template>
  <main>
    <div ref="home" class="home" v-if="shouldShowForm">
      <div class="home__left">
        <img
          ref="homeBg"
          class="home__bg"
          src="/images/background/authentication.png"
          alt="Gradient background"
        />
        <div class="home__slogan">
          <h1 class="home__slogan-title">
            One task at a <span class="home__slogan-sub-title">time</span>
          </h1>
          <p class="home__slogan-msg">
            Stay on task and crush your goals with PomoTasker - your trusty productivity companion
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
          <TheSignup
            ref="signup"
            @successfullyRegistered="successfullyRegistered"
            v-if="canDisplaySignupComponent"
          />
          <TheLogin ref="login" v-else-if="canDisplayLoginComponent" />
        </Transition>

        <span class="home__form-loader" ref="formLoader" v-if="shouldDisplayLoader"></span>
      </div>
    </div>

    <!-- If logged in -->
    <TheHomepage @homepageReady="onHomepageReady" v-if="shouldShowHomePage" />
  </main>
</template>

<script>
// NPM
import { defineAsyncComponent } from 'vue';
import anime from 'animejs';
import { getAuth } from 'firebase/auth';
import Nprogress from 'nprogress';

export default {
  components: {
    TheLogin: defineAsyncComponent(() => import('@/components/single-instance/TheLogin.vue')),
    TheSignup: defineAsyncComponent(() => import('@/components/single-instance/TheSignup.vue')),
    TheHomepage: defineAsyncComponent(() => import('@/components/single-instance/TheHomepage.vue'))
  },
  data() {
    return {
      shouldShowForm: false,
      shouldShowHomePage: false,
      unsubscribeAuth: null,
      animatedOnInitialLoad: false,
      shouldDisplayLoader: false
    };
  },
  mounted() {
    Nprogress.configure({ showSpinner: false });
    Nprogress.start();
    this.checkCurrentlyLoggedInUser();
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
      const animateComponent = () =>
        anime({
          targets: el,
          left: '-100%',
          duration: 450,
          easing: 'easeOutExpo',
          complete: done
        });

      this.$nextTick(() => {
        // Async component is not yet downloaded, once components are loaded but delete from DOM, they will become null
        if (this.$refs.signup === undefined || this.$refs.login === undefined) {
          this.shouldDisplayLoader = true;
          const inter = setInterval(() => {
            if (this.$refs.signup === undefined || this.$refs.login === undefined) return;
            clearInterval(inter);
            animateComponent(); // Start the exit animation of the current displayed component
          });
          return;
        }

        // Element is loaded, no need to wait
        animateComponent();
      });
    },

    onBeforeEnter(el) {
      if (!this.animatedOnInitialLoad) {
        return;
      }

      Object.assign(el.style, {
        opacity: 0
      });
    },

    onEnter(el, done) {
      if (!this.animatedOnInitialLoad) {
        this.animatedOnInitialLoad = true;
        return;
      }

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
          this.shouldDisplayLoader = false;
        }
      });
    },

    checkCurrentlyLoggedInUser() {
      this.unsubscribeAuth = getAuth().onAuthStateChanged((user) => {
        if (user === null) {
          this.shouldShowForm = true;
          this.shouldShowHomePage = false;
          if (this.$route.path === '/') this.$router.push({ name: 'Login' });

          this.$nextTick(() => {
            this.$refs.home.classList.add('home--screen-hidden');
            const int = setInterval(() => {
              if (this.$refs.signup !== undefined || this.$refs.login !== undefined) {
                clearInterval(int);
                this.$refs.home.classList.remove('home--screen-hidden');
                Nprogress.done(true);
              }
            });
          });
          return;
        }

        this.shouldShowForm = false;
        this.shouldShowHomePage = true;
        this.$router.push({ name: 'LandingPage' });
      });
    },

    successfullyRegistered() {
      this.shouldShowForm = false;
      this.shouldShowHomePage = true;
    },

    onHomepageReady() {
      this.$nextTick(() => Nprogress.done(true));
    }
  },
  unmounted() {
    this.unsubscribeAuth();
  },
  computed: {
    canDisplayLoginComponent() {
      const PATH_NAME = this.$route.path;
      return PATH_NAME === '/login';
    },
    canDisplaySignupComponent() {
      const PATH_NAME = this.$route.path;
      return PATH_NAME === '/signup';
    }
  },
  watch: {
    shouldDisplayLoader(shouldDisplayLoader) {
      if (shouldDisplayLoader) {
        this.$nextTick(() => {
          Object.assign(this.$refs.formLoader.style, {
            opacity: 0.7
          });
          anime({
            targets: this.$refs.formLoader,
            opacity: 0.5,
            easing: 'linear',
            direction: 'alternate',
            duration: 350,
            loop: true
          });
        });
      }
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
  min-height: 100vh;
  overflow: hidden;

  &--screen-hidden{
    position: fixed;
    top: 1000%;
    left: 1000%;
  }

  &__bg {
    width: 100%;
    pointer-events: none;
  }

  &__form-loader{
    display: block;
    background-color: white;
    opacity: 0.85;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
      line-height: 1.5;
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
    position: fixed;
    height: 100vh;
    z-index: 999;
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
    min-height: 100vh;
    position: relative;
    background-color: white;
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
    @include margin.right((
      xsm: auto,
        lg: unset
    ));

    .login,
    .signup{
      min-height: calc(100vh - 50px);
    }

    .signup{
      :deep(.signup__form){
        width: 100%;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .login{
      :deep(.form__form){
        width: 100%;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
      }
    }
  }
}
</style>
