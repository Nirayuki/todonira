import database from "../lib/client";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";


const roomCollectionRef = collection(database, "rooms");

class roomService {
  getCurrentPath() {
    // Obtem o caminho da URL em tempo de execução
    return window.location.pathname.substring(1);
  }


  createRoom = async (roomData) => {
    const docRef = await addDoc(roomCollectionRef, roomData);
    return docRef.id; // Retorna o ID do novo documento criado
  }

  addRoomCategoria = async (categoriaData, dataRoom) => {
    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    await updateDoc(roomRef, {categoria: [...dataRoom.categoria, categoriaData]})
  }

  updateCategoria = async (categoriaData) => {
    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    await updateDoc(roomRef, {categoria: categoriaData});
  }

  subscribeRoom = (callback) => {

    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    return onSnapshot(roomRef, (querySnapshot) => {
      callback(querySnapshot.data());
    });
  };
}

export default new roomService();