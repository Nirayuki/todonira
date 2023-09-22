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