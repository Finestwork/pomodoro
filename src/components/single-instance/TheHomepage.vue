<template>
  <div class="homepage">
    <div class="homepage__container">
      <TheNavbar class="nav" />

      <div class="homepage__timer-wrapper">
        <ThePomoLabel />
        <BaseTimerText :color-state="currentColorState" />
        <ThePomodoroControls :current-color-state="currentColorState" />
      </div>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/single-instance/TheNavbar.vue';
import ThePomoLabel from '@/components/single-instance/ThePomoLabel.vue';
import BaseTimerText from '@/components/global/timer/BaseTimerText.vue';
import ThePomodoroControls from '@/components/single-instance/ThePomodoroControls.vue';

// NPM
import { getAuth } from 'firebase/auth';

export default {
  components: { TheNavbar, ThePomoLabel, BaseTimerText, ThePomodoroControls },
  data() {
    return {
      currentColorState: 'initial'
    };
  },
  methods: {
    logoutUser() {
      getAuth().signOut();
    }
  }
};
</script>

<style lang="scss" scoped>
@use 'sass:map';
@use '../../assets/scss/1-settings/css-properties/colors/main';
@use '../../assets/scss/2-tools/mixins/css-properties/margin';
@use '../../assets/scss/2-tools/mixins/css-properties/padding';

// prettier-ignore
.homepage{
  background-color: lighten(map.get(main.$primary, 50), 2%);

  &__container {
    width: 90%;
    min-height: 100vh;
    margin-left: auto;
    margin-right: auto;

    @include padding.all-sides((
        xsm: 0.1
    ));

    .nav {
      @include padding.top((
          xsm: 30
      ));
    }
  }

  &__timer-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    @include margin.top((
      xsm: 50
    ));
  }
}
</style>
