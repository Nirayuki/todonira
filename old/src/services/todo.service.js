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
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const roomCollectionRef = collection(database, "rooms");


class todoService {

  getCurrentPath() {
    // Obtem o caminho da URL em tempo de execução
    return window.location.pathname.substring(1);
  }

  getRoomData = async () => {
    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);

    const docSnap = await getDoc(roomDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  getDocs = async () => {

    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);
    const todoCollectionRef = collection(roomDocRef, "todos");

    const todos = await getDocs(todoCollectionRef, orderBy("createdAt", "desc"));

    return todos.data();
  };

  addTodo = async (todo) => {

    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);
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

  subscribeToTodos = (callback) => {

    const currentPath = this.getCurrentPath();
    const roomDocRef = doc(database, "rooms", currentPath);
    const todoCollectionRef = collection(roomDocRef, "todos");

    return onSnapshot(todoCollectionRef, (querySnapshot) => {
      const todos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Ordenar os todos pelo campo createdAt
      todos.sort((a, b) => b.createdAt - a.createdAt);

      callback(todos);
    });
  };

}

export default new todoService();