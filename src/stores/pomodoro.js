import { defineStore } from 'pinia';

const useStoredPomodoros = defineStore('storedPomodoros', {
  state: () => ({
    // Already sorted by date in chart progress component
    pomodoros: []
  }),
  getters: {
    hasPomodoros() {
      return this.pomodoros.length !== 0;
    },
    getPomodoros() {
      return this.pomodoros.map((pom) => pom.pomodoros);
    },
    getDates() {
      return this.pomodoros.map((pom) => pom.date);
    }
  },
  actions: {
    storeCloudPomodoros(pomodoros) {
      // Sort by oldest to latest
      this.pomodoros = pomodoros
        .map((doc) => {
          const DATA = doc.data();
          return {
            pomodoros: DATA.pomodoros,
            date: DATA.date
          };
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    // Only increment by 1 the today pomodoro activity
    incrementTodayPomodoro() {
      const TODAY = new Date().toLocaleDateString('en', { dateStyle: 'short' });
      const IND = this.pomodoros.findIndex((pom) => pom.date === TODAY);

      if (IND === -1) return;

      this.pomodoros[IND].pomodoros++;
    }
  }
});

export { useStoredPomodoros };
