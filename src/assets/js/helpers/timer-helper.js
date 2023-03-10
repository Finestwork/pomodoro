export default class TimerHelper {
  // Formats the current duration into proper time format
  static formatString(currentDuration) {
    const MINUTES = Math.floor(currentDuration / 60);
    const SECONDS = currentDuration % 60;
    return `${MINUTES.toString().padStart(2, '0')}:${SECONDS.toString().padStart(2, '0')}`;
  }
}
