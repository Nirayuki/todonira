'use client'
import { database, auth } from '../lib/cliente';
import {
    addDoc,
    collection,
    updateDoc,
    doc,
    getDoc,
    onSnapshot
} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


const Collection = collection(database, "users");

class userService {
    createUser = async (props) => {
        await createUserWithEmailAndPassword(auth, props.email, props.senha)
            .then(async (user) => {
                await setDoc(doc(database, Collection, user.uid), {
                    id: user.uid,
                    email: props.email,
                    listas: []
                })
            })
            .catch((err) => {
                console.error(err);
            })
    }

    getUser = async (id) => {
        try {
            const docRef = doc(Collection, id);
            const res = await getDoc(docRef);

            return res.data();

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
}

export default new userService();