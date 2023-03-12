export default class GoogleCodeErrors {
  static #ERRORS = {
    'auth/email-already-in-use': 'Email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/wrong-password': 'Your email and password do not match our records.',
    'auth/user-mismatch': 'Your email and password do not match our records.',
    'auth/user-not-found': 'Your email does not exist.',
    'auth/requires-recent-login':
      'User needs to login again to perform security-sensitive actions.',
    'auth/user-token-expired': 'Token expired.'
  };

  static get getErrors() {
    return GoogleCodeErrors.#ERRORS;
  }
}
