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

    if(dataRoom.categoria){
      await updateDoc(roomRef, {categoria: [...dataRoom.categoria, categoriaData]})
    }else{
      await updateDoc(roomRef, {categoria: [categoriaData]});
    }
  }

  addBadge = async (dataRoom, dataBadge) => {
    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    if(dataRoom.badges){
      await updateDoc(roomRef, {badges: [...dataRoom.badges, dataBadge]})
    }else{
      await updateDoc(roomRef, {badges: [dataBadge]});
    }
  }

  updateCategoria = async (categoriaData) => {
    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    await updateDoc(roomRef, {categoria: categoriaData});
  }

  updateBadge = async (badgeData) => {
    const currentPath = this.getCurrentPath();
    const roomRef = doc(database, "rooms", currentPath);

    await updateDoc(roomRef, {badges: badgeData});
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