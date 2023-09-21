'use client'
import { database } from "@/lib/cliente";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const Collection = collection(database, "listas");


class listaService {
  getLista = async (id) => {
    console.log(id);
    const docRef = doc(database, "listas", id);

    const resDoc = await getDoc(docRef);

    if (resDoc.exists()) {
      return resDoc.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
}

export default new listaService();