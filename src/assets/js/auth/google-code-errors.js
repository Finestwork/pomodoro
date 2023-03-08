export default class GoogleCodeErrors {
  static #ERRORS = {
    'auth/email-already-in-use': 'Email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.'
  };

  static get getErrors() {
    return GoogleCodeErrors.#ERRORS;
  }
}
