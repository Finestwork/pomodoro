<template>
  <div :class="getRootClass" ref="root">
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
import { useStoredPomodoros } from '@/stores/pomodoro';
import UserCollection from '@/assets/js/firestore/user-collection';
import TimerHelper from '@/assets/js/helpers/timer-helper';
import PomodoroHelper from '@/assets/js/firestore/pomodoro';
import DocumentTitleHelper from '@/assets/js/helpers/document-title-helper';
import AudioHelper from '@/assets/js/helpers/audio-helper';

// NPM
import { useToast } from 'vue-toastification';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import NotificationHelper from '@/assets/js/helpers/notification-helper';

export default {
  components: { TheNavbar, ThePomoLabel, BaseTimerText, ThePomodoroControls },
  data() {
    return {
      currentColorState: 'focus',
      isPlaying: false,
      roomSettingsStore: useRoomSettingsStore(),
      storedPomodoros: useStoredPomodoros(),
      timerText: useRoomSettingsStore().timerText,
      currentDuration: 0,
      timerIntervalId: null,
      nextState: 'short-break',
      toastOptions: {
        position: 'bottom-right',
        timeout: 5016,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false
      }
    };
  },
  mounted() {
    AudioHelper.init();
    // Hide first the component until data from firestore are fully loaded
    Object.assign(this.$refs.root.style, {
      position: 'absolute',
      top: '9999%',
      left: '9999%'
    });

    // Check if dark mode is enabled
    const IS_DARK_MODE = localStorage.getItem('PomoTaskerDarkMode');
    if (IS_DARK_MODE !== null) document.body.classList.add('dark');

    // Get the pomodoro room settings from firestore
    UserCollection.getDocument()
      .then((res) => {
        if (res.docs.length === 0) {
          this.$refs.root.style = null;
          this.$emit('homepageReady');
          return;
        }

        // If document is not empty
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

        this.getStoredPomodorosFromFirebase();
        setTimeout(() => {
          this.$refs.root.style = null;
          this.$emit('homepageReady');
        }, 250); // Add delay
      })
      .catch(() => {
        this.$refs.root.style = null;

        useToast().error(
          'Unable to get your saved room settings from the database.',
          this.toastOptions
        );

        // Even tho stored settings are not fetched, user can still use the app
        this.$emit('homepageReady');
      });
  },
  methods: {
    togglePlay() {
      this.isPlaying = !this.isPlaying;

      if (!this.isPlaying) {
        if (this.roomSettingsStore.soundEnabled) AudioHelper.pause();
        clearInterval(this.timerIntervalId);
        DocumentTitleHelper.changeOnState(this.currentColorState, ' - Paused');
        return;
      }

      if (this.roomSettingsStore.soundEnabled) AudioHelper.play();
      DocumentTitleHelper.changeOnState(this.currentColorState, ' - Playing');
      this.timerIntervalId = setInterval(() => {
        this.currentDuration--;
        this.timerText = TimerHelper.formatString(this.currentDuration);
        DocumentTitleHelper.changeOnState(this.currentColorState, ` - ${this.timerText}`);

        if (this.currentDuration === 0) {
          clearInterval(this.timerIntervalId);
          this.timerIntervalId = false;
          this.isPlaying = false;

          // Send notification
          if (NotificationHelper.isEnabled()) {
            switch (this.currentColorState) {
              case 'focus':
                NotificationHelper.create('Focus session is done!', {
                  icon: `${window.location.origin}/images/logo/pomotasker.svg`,
                  body: "Do not be too hard on yourself, take a break.  It's important to take breaks to recharge your brain and avoid burnout."
                });
                break;
              case 'short-break':
                NotificationHelper.create('Short break session is done', {
                  icon: `${window.location.origin}/images/logo/pomotasker.svg`,
                  body: 'This is your time to focus on your task and give it your all. Remember to stay hydrated and take care of yourself during this time. You got this!'
                });
                break;
              case 'long-break':
                NotificationHelper.create('Long Break Session Done!', {
                  icon: `${window.location.origin}/images/logo/pomotasker.svg`,
                  body: "Welcome back from your long break! I hope you feel refreshed and re-energized. Let's dive back in and tackle the next set of tasks with renewed energy and focus!"
                });
            }
          }

          this.getNextSession();

          // After each session, create a sound notification
          if (this.roomSettingsStore.soundEnabled) {
            switch (this.currentColorState) {
              case 'focus':
                AudioHelper.focus();
                break;
              case 'short-break':
                AudioHelper.shortBreak();
                break;
              case 'long-break':
                AudioHelper.longBreak();
            }
          }
        }
      }, 1000);
    },
    nextSession() {
      if (this.roomSettingsStore.soundEnabled) AudioHelper.pause();
      this.getNextSession();
    },
    getStoredPomodorosFromFirebase() {
      PomodoroHelper.getAll()
        .then((res) => {
          this.storedPomodoros.storeCloudPomodoros(res.docs);
        })
        .catch(() => {
          useToast().error(
            'Uh-oh! Unable to fetch your recent pomodoro activity.',
            this.toastOptions
          );
        });
    },
    savePomodoro() {
      // If recent pomodoro activities aren't fetched on page load
      if (!this.storedPomodoros.hasPomodoros) {
        PomodoroHelper.getAll()
          .then((res) => {
            this.storedPomodoros.storeCloudPomodoros(res.docs);
            PomodoroHelper.save()
              .then(() => {
                this.storedPomodoros.incrementTodayPomodoro();
              })
              .catch(() => {
                useToast().error(
                  'Unable to store your latest pomodoro activity.',
                  this.toastOptions
                );
              });
          })
          .catch(() => {
            useToast().error(
              'Uh-oh! Unable to fetch your recent pomodoro activity.',
              this.toastOptions
            );
          });

        return;
      }

      PomodoroHelper.save()
        .then(() => {
          this.storedPomodoros.incrementTodayPomodoro();
        })
        .catch(() => {
          useToast().error('Unable to store your latest pomodoro activity.', this.toastOptions);
        });
    },

    /*
     * =================
     * Helpers
     * =================
     */

    getNextSession() {
      if (this.isPlaying) {
        this.isPlaying = false;
        clearInterval(this.timerIntervalId);
      }

      if (this.roomSettingsStore.isNextSessionLongBreak) {
        this.savePomodoro();
        this.currentColorState = 'long-break';
        this.nextState = 'pomodoro';
        DocumentTitleHelper.changeOnState(this.currentColorState, ' - Paused');
        this.currentDuration = this.roomSettingsStore.longBreakLength * 60;
        this.roomSettingsStore.resetPomodoroLeft();
        this.timerText = TimerHelper.formatString(this.currentDuration);
        return;
      }

      switch (this.nextState) {
        case 'short break':
          this.savePomodoro();
          this.currentDuration = this.roomSettingsStore.shortBreakLength * 60;
          this.nextState = 'pomodoro';
          this.currentColorState = 'short-break';
          DocumentTitleHelper.changeOnState(this.currentColorState, ' - Paused');
          break;
        case 'pomodoro':
          this.currentDuration = this.roomSettingsStore.pomodoroDuration * 60;
          this.nextState = 'short break';
          this.currentColorState = 'focus';
          DocumentTitleHelper.changeOnState(this.currentColorState, ' - Paused');
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
  &.focus {
    background-color: lighten(map.get(main.$primary, 50), 2%);
  }

  &.short-break {
    background-color: lighten(map.get(main.$secondary, 50), 2%);
  }

  &.long-break {
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
        xsm: 50,
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

.dark {
  .homepage {
    &.focus {
      background-color: darken(map.get(main.$primary, 900), 10%);
    }

    &.short-break {
      background-color: darken(map.get(main.$secondary, 900), 10%);
    }

    &.long-break {
      background-color: darken(map.get(main.$tertiary, 900), 8%);
    }
  }
}
</style>
