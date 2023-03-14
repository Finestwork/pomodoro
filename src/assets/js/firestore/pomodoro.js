import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc
} from 'firebase/firestore';

export default class PomodoroHelper {
  // Before saving get the current pomodoro for today, if no then 0
  static save() {
    return new Promise((resolve, reject) => {
      const CURRENT_USER = getAuth().currentUser.uid;
      const TODAY = new Date().toLocaleDateString('en', { dateStyle: 'short' });

      const COLLECTION = collection(getFirestore(), 'pomodoros');
      let CURRENT_QUERY = query(COLLECTION, where('date', '==', TODAY));
      CURRENT_QUERY = query(CURRENT_QUERY, where('userId', '==', CURRENT_USER));

      getDocs(CURRENT_QUERY)
        .then((snapshot) => {
          // If no documents retrieved
          if (snapshot.empty) {
            addDoc(COLLECTION, {
              pomodoros: 1,
              date: TODAY,
              userId: getAuth().currentUser.uid
            })
              .then((res) => resolve(res))
              .catch((err) => reject(err));

            return;
          }

          // If document is already created, update the current pomodoro
          const DOC = snapshot.docs[0];
          const DATA = DOC.data();
          const DOC_REF = doc(getFirestore(), 'pomodoros', DOC.id);

          updateDoc(DOC_REF, {
            pomodoros: DATA.pomodoros + 1
          })
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  // Get all docs
  static getAll() {
    return new Promise((resolve, reject) => {
      const CURRENT_USER = getAuth().currentUser.uid;
      const COLLECTION = collection(getFirestore(), 'pomodoros');
      const QUERY = query(COLLECTION, where('userId', '==', CURRENT_USER));

      getDocs(QUERY)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}
