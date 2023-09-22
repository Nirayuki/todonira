'use client'
import { database } from '../lib/cliente'
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

const roomCollectionRef = collection(database, "rooms");


class todoService {

  getDocs = async (roomId) => {
    try{
      const roomDocRef = doc(database, "rooms", roomId);
      const todoCollectionRef = collection(roomDocRef, "todos");

      const todos = await getDocs(todoCollectionRef, orderBy("createdAt", "desc"));

      if(todos){
        return todos.docs.map((item) => item.data());
      }else{
        return false
      }
    }catch(err){
      return false
    }
  };

  addTodo = async (id, todo) => {
    try{
      const todoRef = doc(database, "listas", id);

      const todoDoc = await getDoc(todoRef);
      let todos = todoDoc.data().todos;
      todos.push({
        ...todo,
        createdAt: new Date()
      });

      await updateDoc(todoRef, {
        todos: todos
      })

      return true
    }catch(err){
      console.error(err);
      return false
    }

  }

  addTodoOld = async (id, todo) => {
    const roomDocRef = doc(database, "rooms", id);
    const todoCollectionRef = collection(roomDocRef, "todos");

    return await addDoc(todoCollectionRef, {
      ...todo,
      createdAt: serverTimestamp()
    });
  };

  deleteTodo = async (todoId) => {

    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);
    const todoCollectionRef = collection(roomDocRef, "todos");

    const todoDocRef = doc(todoCollectionRef, todoId);
    await deleteDoc(todoDocRef);
  };

  updateTodo = async (todoId, updatedData) => {

    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);
    const todoCollectionRef = collection(roomDocRef, "todos");

    const todoDocRef = doc(todoCollectionRef, todoId);
    await updateDoc(todoDocRef, updatedData);
  };
}

export default new todoService();