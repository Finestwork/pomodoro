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
      this.pomodoros = pomodoros.map((doc) => {
        const DATA = doc.data();
        return {
          pomodoros: DATA.pomodoros,
          date: DATA.date
        };
      });

      // If recent activity is only 1 then add a padding before the current date
      if (this.pomodoros.length === 1) {
        let date = new Date(this.pomodoros[0].date);
        date = new Date(date.setDate(date.getDate() - 1));
        this.pomodoros.push({
          pomodoros: -1,
          date: date.toLocaleDateString('en', {
            dateStyle: 'short'
          })
        });
      }

      // Then sort from oldest to latest date
      this.pomodoros.sort((a, b) => new Date(a.date) - new Date(b.date));
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
