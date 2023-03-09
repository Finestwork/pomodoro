import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default class UserCollection {
  // Add new documents to the collection
  static addData(data) {
    const COLLECTION = collection(getFirestore(), 'Users');
    return addDoc(COLLECTION, data);
  }
}
