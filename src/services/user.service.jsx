'use client'
import { database, auth } from '../lib/cliente';
import {
    addDoc,
    collection,
    updateDoc,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc
} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


const Collection = collection(database, "users");

class userService {
    createUser = async (props) => {
        try{
           const res = await createUserWithEmailAndPassword(auth, props.email, props.senha)
            .then(async (user) => {
                console.log(user);
                const docRef = doc(Collection, user.user.uid)
                await setDoc(docRef, {
                    id: user.user.uid,
                    email: props.email,
                    name: props.nome,
                    listas: [],
                    createdAt: serverTimestamp()
                })

                localStorage.setItem("user", JSON.stringify({
                    id: user.user.uid,
                    name: props.nome
                }))

                return "success"
            })
            .catch((err) => {
                console.error(err);
                return err.message
            })


            return res
        }catch(err){
            console.error(err);
            return err.message
        }
    }

    getUser = async (id) => {
        try {
            const docRef = doc(Collection, id);
            const res = await getDoc(docRef);

            return {
                id: res.data().id,
                name: res.data().name,
                listas: res.data().listas,
                email: res.data().email
            };

        } catch (err) {
            return err;
        }
    }

    signUser = async (props) => {
        try {
            await signInWithEmailAndPassword(auth, props.email, props.senha)
                .then(async (user) => {
                    const userRes = await this.getUser(user.user.uid);
                    console.log(userRes);

                    localStorage.setItem("user", JSON.stringify({
                        id: userRes.id,
                        name: userRes.name
                    }));

                    return "success"
                })
                .catch((err) => {
                    console.error(err);
                    return "error"
                })
        } catch (err) {
            console.error(err);
            return "error"
        }
    }

    updateUserListas = async (id, data) => {
        const docRef = doc(Collection, id);

        await updateDoc(docRef, {
            listas: data
        })
    }
}

export default new userService();