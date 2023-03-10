<template>
  <div :class="getRootClass">
    <div class="homepage__container">
      <TheNavbar :color-state="currentColorState" />

      <div class="homepage__timer-wrapper">
        <ThePomoLabel class="homepage__pomo-label" :color-state="currentColorState" />
        <BaseTimerText
          :color-state="currentColorState"
          :is-playing="isPlaying"
          :timer-text="timerText"
        />
        <ThePomodoroControls
          class="homepage__pomo-controls"
          :current-color-state="currentColorState"
          :is-playing="isPlaying"
          :next-state="nextState"
          @onTogglePlay="togglePlay"
          @nextSession="nextSession"
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
import TimerHelper from '@/assets/js/helpers/timer-helper';

export default {
  components: { TheNavbar, ThePomoLabel, BaseTimerText, ThePomodoroControls },
  data() {
    return {
      currentColorState: 'focus',
      isPlaying: false,
      roomSettingsStore: useRoomSettingsStore(),
      timerText: useRoomSettingsStore().timerText,
      currentDuration: 0,
      timerIntervalId: null,
      nextState: 'short-break'
    };
  },
  mounted() {
    UserCollection.getDocument()
      .then((res) => {
        const DOC = doc(getFirestore(), 'Users', res.docs[0].id);
        onSnapshot(DOC, (docs) => {
          const { pomodoroDuration, pomodoros, longBreak, shortBreak } = docs.data().roomSettings;
          this.roomSettingsStore.changePomodoroDuration(pomodoroDuration);
          this.roomSettingsStore.changeNumberOfPomodoro(pomodoros);
          this.roomSettingsStore.changeShortBreakLength(shortBreak);
          this.roomSettingsStore.changeLongBreakLength(longBreak);
          this.timerText = useRoomSettingsStore().timerText;

          // Everytime the settings is updated, this will reset the pomodoro sessions
          clearInterval(this.timerIntervalId);
          this.isPlaying = false;
          this.currentColorState = 'focus';
          this.currentDuration = pomodoroDuration * 60; // Convert minutes to seconds
          this.timerText = TimerHelper.formatString(this.currentDuration);
          this.nextState = 'short break';
          this.roomSettingsStore.resetPomodoroLeft();
          this.roomSettingsStore.decrementPomodoroLeft();
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
        this.timerText = TimerHelper.formatString(this.currentDuration);

        if (this.currentDuration === 0) {
          clearInterval(this.timerIntervalId);
          this.timerIntervalId = false;
          this.isPlaying = false;
        }
      }, 1000);
    },
    nextSession() {
      if (this.isPlaying) {
        this.isPlaying = false;
        clearInterval(this.timerIntervalId);
      }

      if (this.roomSettingsStore.isNextSessionLongBreak) {
        this.currentColorState = 'long-break';
        this.nextState = 'pomodoro';
        this.currentDuration = this.roomSettingsStore.longBreakLength * 60;
        this.roomSettingsStore.resetPomodoroLeft();
        this.timerText = TimerHelper.formatString(this.currentDuration);
        return;
      }

      switch (this.nextState) {
        case 'short break':
          this.currentDuration = this.roomSettingsStore.shortBreakLength * 60;
          this.nextState = 'pomodoro';
          this.currentColorState = 'short-break';
          break;
        case 'pomodoro':
          this.currentDuration = this.roomSettingsStore.pomodoroDuration * 60;
          this.nextState = 'short break';
          this.currentColorState = 'focus';
          this.roomSettingsStore.decrementPomodoroLeft();
          break;
      }

      this.timerText = TimerHelper.formatString(this.currentDuration);
    }
  },
  computed: {
    getRootClass() {
      return `homepage ${this.currentColorState}`;
    }
  },
  watch: {
    currentColorState: {
      handler(colorState, prevColorState) {
        document.body.classList.remove(prevColorState);
        document.body.classList.add(colorState);
      },
      immediate: true
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
.homepage {
  &.focus{
    background-color: lighten(map.get(main.$primary, 50), 2%);
  }
  &.short-break{
    background-color: lighten(map.get(main.$secondary, 50), 2%);
  }
  &.long-break{
    background-color: lighten(map.get(main.$tertiary, 50), 2%);
  }


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

  &__timer-wrapper {
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

  &__pomo-label {
    @include margin.top((
        lg: 100
    ));
    @include margin.bottom((
        xsm: 25
    ));
  }

  &__pomo-controls {
    @include margin.top((
        xsm: 15
    ));
  }
}
</style>
