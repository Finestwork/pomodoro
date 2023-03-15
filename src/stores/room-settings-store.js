import { defineStore } from 'pinia';

const useRoomSettingsStore = defineStore('roomSettingsStore', {
  state: () => ({
    pomodorosLeft: 4,
    pomodoros: 4,
    pomodoroDuration: 25, // in minutes
    shortBreakLength: 5, // in minutes
    longBreakLength: 15, // in minutes,

    // Properties below are not stored in firestore, just a local copy
    notificationEnabled: false,
    soundEnabled: true,
    darkModeEnabled: false
  }),
  getters: {
    notYetStarted() {
      return this.pomodoros === this.pomodorosLeft;
    },
    isNextSessionLongBreak() {
      return this.pomodorosLeft === 0;
    },
    timerText() {
      return `${this.pomodoroDuration.toString().padStart(2, '0')}:00`;
    }
  },
  actions: {
    changeNumberOfPomodoro(pomodoros) {
      this.pomodorosLeft = pomodoros;
      this.pomodoros = pomodoros;
    },
    changePomodoroDuration(duration) {
      this.pomodoroDuration = duration;
    },
    changeShortBreakLength(newLength) {
      this.shortBreakLength = newLength;
    },
    changeLongBreakLength(newLength) {
      this.longBreakLength = newLength;
    },
    changeNotification(notificationEnabled) {
      this.notificationEnabled = notificationEnabled;
    },
    changeDarkMode(darkModeEnabled) {
      this.darkModeEnabled = darkModeEnabled;
    },
    changeSound(soundEnabled) {
      this.soundEnabled = soundEnabled;
    },
    decrementPomodoroLeft() {
      this.pomodorosLeft--;
    },
    resetPomodoroLeft() {
      this.pomodorosLeft = this.pomodoros;
    }
  }
});

export { useRoomSettingsStore };
