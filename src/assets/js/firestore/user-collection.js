import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';

export default class UserCollection {
  // Add new documents to the collection
  static addData(data) {
    const COLLECTION = collection(getFirestore(), 'Users');
    return addDoc(COLLECTION, data);
  }

  // Add new documents to the collection
  static update(data) {
    return new Promise((resolve, reject) => {
      UserCollection.getDocument()
        .then((res) => {
          const DOC_REF = doc(getFirestore(), 'Users', res.docs[0].id);
          updateDoc(DOC_REF, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  // Gets document
  static getDocument() {
    const USER_ID = getAuth().currentUser.uid;
    const COLLECTION = collection(getFirestore(), 'Users');
    const QUERY = query(COLLECTION, where('userId', '==', USER_ID));
    return new Promise((resolve, reject) => {
      getDocs(QUERY)
        .then((res) => resolve(res))
        .then((err) => reject(err));
    });
  }

  static get currentUser() {
    return getAuth().currentUser;
  }
}
