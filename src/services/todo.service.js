import database from "../lib/client";
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
  } from "firebase/firestore";



const todoCollectionRef = collection(database, "todo");

class todoService{
    addTodo = async (post) => {
        return await addDoc(todoCollectionRef, post);
      };
    
      
}

export default new todoService();