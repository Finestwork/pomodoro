export default class AudioHelper {
  static #SOURCE = [
    '/audios/play.mp3',
    '/audios/pause.mp3',
    '/audios/focus.mp3',
    '/audios/short-break.mp3',
    '/audios/long-break.mp3'
  ];
  static #PRELOADED_AUDIOS = {};
  static #AUDIO = new Audio();

  // Make all audios preloaded
  static init() {
    AudioHelper.#SOURCE.forEach((audioSrc, ind) => {
      const PROP =
        ind === 0
          ? 'play'
          : ind === 1
          ? 'pause'
          : ind === 2
          ? 'focus'
          : ind === 3
          ? 'shortBreak'
          : 'longBreak';

      const AUDIO = new Audio();
      AUDIO.src = audioSrc;
      AUDIO.preload = 'auto';
      const onCanPlayThrough = () => {
        Object.assign(AudioHelper.#PRELOADED_AUDIOS, { [PROP]: AUDIO });
      };

      AUDIO.addEventListener('canplaythrough', onCanPlayThrough);
    });
  }

  static play() {
    AudioHelper.#PRELOADED_AUDIOS.play.play();
  }

  static pause() {
    AudioHelper.#PRELOADED_AUDIOS.pause.play();
  }

  static focus() {
    AudioHelper.#PRELOADED_AUDIOS.focus.play();
  }

  static shortBreak() {
    AudioHelper.#PRELOADED_AUDIOS.shortBreak.play();
  }

  static longBreak() {
    AudioHelper.#PRELOADED_AUDIOS.longBreak.play();
  }
}
