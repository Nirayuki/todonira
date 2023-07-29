import database from "../lib/client";
import {
  addDoc,
  collection,
} from "firebase/firestore";


const roomCollectionRef = collection(database, "rooms");

class roomService {
    createRoom = async (roomData) => {
        const docRef = await addDoc(roomCollectionRef, roomData);
        return docRef.id; // Retorna o ID do novo documento criado
      }
}

export default new roomService();