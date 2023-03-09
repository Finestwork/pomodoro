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
      const { uid: USER_ID } = getAuth().currentUser;
      const COLLECTION = collection(getFirestore(), 'Users');
      const QUERY = query(COLLECTION, where('userId', '==', USER_ID));
      getDocs(QUERY)
        .then((res) => {
          const DOC_REF = doc(getFirestore(), 'Users', res.docs[0].id);

          updateDoc(DOC_REF, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }
}
