import { defineStore } from 'pinia';

const useRoomSettingsStore = defineStore('roomSettingsStore', {
  state: () => ({
    pomodoros: 4,
    pomodoroDuration: 25, // in minutes
    shortBreakLength: 5, // in minutes
    longBreakLength: 15 // in minutes
  }),
  actions: {
    changeNumberOfPomodoro(pomodoros) {
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
    }
  }
});

export { useRoomSettingsStore };
