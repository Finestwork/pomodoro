export default class NotificationHelper {
  static isEnabled() {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  static askPermission() {
    return new Promise((resolve, reject) => {
      // If browser do not support notification
      if (!('Notification' in window)) resolve('not supported');

      Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') resolve('granted');
          if (permission === 'default') resolve('default');
        })
        .catch((err) => reject(err));
    });
  }

  static create(msg, opt) {
    // If browser do not support notification
    if (!('Notification' in window)) return;

    // If notification is always granted, create a notification
    if (Notification.permission === 'granted') {
      new Notification(msg, opt);
    }
  }
}
