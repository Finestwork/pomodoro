<template>
  <div class="homepage">
    <div class="homepage__container">
      <TheNavbar />

      <div class="homepage__timer-wrapper">
        <ThePomoLabel class="homepage__pomo-label" />
        <BaseTimerText
          :color-state="currentColorState"
          :is-playing="isPlaying"
          :timer-text="timerText"
        />
        <ThePomodoroControls
          class="homepage__pomo-controls"
          :current-color-state="currentColorState"
          @onTogglePlay="togglePlay"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/single-instance/TheNavbar.vue';
import ThePomoLabel from '@/components/single-instance/ThePomoLabel.vue';
import BaseTimerText from '@/components/global/timer/BaseTimerText.vue';
import ThePomodoroControls from '@/components/single-instance/ThePomodoroControls.vue';
import { useRoomSettingsStore } from '@/stores/room-settings-store';
import UserCollection from '@/assets/js/firestore/user-collection';

// NPM
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

export default {
  components: { TheNavbar, ThePomoLabel, BaseTimerText, ThePomodoroControls },
  data() {
    return {
      currentColorState: 'initial',
      isPlaying: false,
      roomSettingsStore: useRoomSettingsStore(),
      timerText: useRoomSettingsStore().timerText,
      currentDuration: 0,
      timerIntervalId: null
    };
  },
  updated() {},
  mounted() {
    UserCollection.getDocument()
      .then((res) => {
        const DOC = doc(getFirestore(), 'Users', res.docs[0].id);
        this.unsubscribe = onSnapshot(DOC, (docs) => {
          const { pomodoroDuration, pomodoros, longBreak, shortBreak } = docs.data().roomSettings;
          this.roomSettingsStore.changePomodoroDuration(pomodoroDuration);
          this.roomSettingsStore.changeNumberOfPomodoro(pomodoros);
          this.roomSettingsStore.changeShortBreakLength(shortBreak);
          this.roomSettingsStore.changeLongBreakLength(longBreak);
          this.timerText = useRoomSettingsStore().timerText;
          this.currentDuration = pomodoroDuration * 60; // Convert minutes to seconds
        });
      })
      .catch(() => {
        // Server error I guess?
      });
  },
  methods: {
    togglePlay() {
      this.isPlaying = !this.isPlaying;

      if (!this.isPlaying) {
        clearInterval(this.timerIntervalId);
        return;
      }

      this.timerIntervalId = setInterval(() => {
        this.currentDuration--;
        const MINUTES = Math.floor(this.currentDuration / 60);
        const SECONDS = this.currentDuration % 60;
        this.timerText = `${MINUTES.toString().padStart(2, '0')}:${SECONDS.toString().padStart(
          2,
          '0'
        )}`;

        if (this.currentDuration === 0) {
          clearInterval(this.timerIntervalId);
          this.timerIntervalId = false;
          this.isPlaying = false;
        }
      }, 1000);
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
    justify-content: center;
    min-height: 100vh;
    position: relative;
    @include padding.bottom((
      xsm: 50
    ));
  }

  &__pomo-label{
    @include margin.top((
      lg: 100
    ));
    @include margin.bottom((
        xsm: 25
    ));
  }

  &__pomo-controls{
    @include margin.top((
        xsm: 15
    ));
  }
}
</style>
