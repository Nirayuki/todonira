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
import userService from "./user.service";
import todoService from './todo.service';

const Collection = collection(database, "listas");


class listaService {
  getLista = async (id) => {
    const docRef = doc(database, "listas", id);

    const resDoc = await getDoc(docRef);

    if (resDoc.exists()) {
      return resDoc.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  deleteLista = async (id) => {
    try{
      const docRef = doc(Collection, id);

      await deleteDoc(docRef);

      const localUser = JSON.parse(localStorage.getItem("user"));

      const user = await userService.getUser(localUser.id);
      let listas = user.listas;

      listas = listas.filter(item => item.id !== id);

      await userService.updateUserListas(user.id, listas);

      return true
    }catch(err){
      return false
    }
  }

  updateTodo = async (idLista, todo) => {
    try{
      const docRef = doc(Collection, idLista);
      const lista = await getDoc(docRef);
      let todos = lista.data().todos;

      let EditTodo = todos.find(item => item.id === todo.id);

      if(todo.title){
        if(EditTodo.title){
          EditTodo.title = todo.title;
        }
  
        if(EditTodo.text){
          EditTodo.text = todo.title; 
        }
      }

      if(todo.hasOwnProperty("checked")){
        if(EditTodo.hasOwnProperty("completed")){
          EditTodo.completed = todo.checked;
        }
  
        if(EditTodo.hasOwnProperty("checked")){
          EditTodo.checked = todo.checked; 
        }
      }

      await updateDoc(docRef, {
        todos: todos
      })

      return true
    }catch(err){
      return false
    }
  }

  deleteTodo = async (idLista, idTodo) => {
    try{
      const docRef = doc(Collection, idLista);
      const lista = await getDoc(docRef);

      let listas = lista.data().todos;

      listas = listas.filter(item => item.id !== idTodo);

      await updateDoc(docRef, {
        todos: listas
      });

      return true
    }catch(err){
      console.error(err);
      return false
    }
  }

  updateLista = async (lista) => {
    try{
      const localUser = JSON.parse(localStorage.getItem("user"));

      const user = await userService.getUser(localUser.id);
      let listas = user.listas;

      let editLista = listas.find((item => item.id === lista.id))

      editLista.title = lista.title;

      await userService.updateUserListas(user.id, listas);

      const docRef = doc(Collection, lista.id);
      await updateDoc(docRef, {
        title: lista.title
      });


      return true

    }catch(err){
      console.error(err);
      return false
    }
  }

  addLista = async (nome) => {
    try {
      const res = await addDoc(Collection, {
        title: nome,
        todos: [],
        createdAt: serverTimestamp()
      });

      const docRef = doc(Collection, res.id);

      await updateDoc(docRef, {
        id: res.id
      })

      const localUser = JSON.parse(localStorage.getItem("user"));

      const user = await userService.getUser(localUser.id);
      let listas = user.listas;

      listas.push({
        title: nome,
        id: res.id
      })

      await userService.updateUserListas(user.id, listas);

      return res.id
    } catch (err) {
      return false
    }
  }

  importarLista = async (props) => {
    try {
      const todos = await todoService.getDocs(props.codigo);
      const localUser = JSON.parse(localStorage.getItem("user"));

      if (!todos.length === 0) {
        console.log(`Ciau aqui no todos: ${todos}`);
        const res = await addDoc(Collection, {
          title: props.nome,
          todos: todos,
          createdAt: serverTimestamp()
        });

        const docRef = doc(Collection, res.id);

        await updateDoc(docRef, {
          id: res.id
        });

        const user = await userService.getUser(localUser.id);
        let listas = user.listas;

        listas.push({
          title: props.nome,
          id: res.id
        })

        await userService.updateUserListas(user.id, listas);

        return res.id;
      }else{
        return false
      }
    } catch (err) {
      console.error(err);
      return false
    }
  }
}

export default new listaService();