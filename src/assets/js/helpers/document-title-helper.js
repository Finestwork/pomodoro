export default class DocumentTitleHelper {
  // Change document title based on state
  static changeOnState(state, extraWords) {
    const WORD =
      state
        .split('-')
        .map((word) => {
          return word.substring(0, 1).toUpperCase() + word.substring(1);
        })
        .join(' ') + extraWords;

    document.title = WORD;
  }

  // Just change the document title
  static change(title) {
    document.title = title;
  }
}
