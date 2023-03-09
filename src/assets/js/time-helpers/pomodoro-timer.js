export default class PomodoroTimer {
  #minutes;
  #currentSeconds = 0;
  #totalSeconds = 0;
  #timerIntervalId = null;

  constructor(minutes) {
    this.#minutes = minutes;
    this.#currentSeconds = minutes * 60;
    this.#totalSeconds = minutes * 60;

    // to make sure that the context of this will not change
    this.start = this.start.bind(this);
  }

  #timer(cb) {
    const MINUTE = Math.floor(this.#currentSeconds / 60);
    const SECONDS = this.#currentSeconds % 60;
    this.#currentSeconds--;
    const TIMER = `${MINUTE}:${SECONDS.toString().padStart(2, '0')}`;

    cb(TIMER);
  }

  start(cb) {
    if (this.#currentSeconds === this.#totalSeconds) this.#timer(cb);
    this.timerIntervalId = setInterval(() => {
      this.#timer(cb);
      if (this.#currentSeconds === 0) {
        clearInterval(this.timerIntervalId);
      }
    }, 1000);
  }

  pause() {
    clearInterval(this.timerIntervalId);
  }
}
