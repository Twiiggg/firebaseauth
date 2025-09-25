//importa as funções necessárias do firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";
// template de configuração do firebaseConfig.js 
// const firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: "",
//     appId: ""  
// };

//configuração do firebase

//inicia o firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(); // firebase auth config
const db = getFirestore(); // firestore config

// monitora o estado de autenticação do user
onAuthStateChanged(auth, (user) => {
    // busca o id do user autenticado salvo no localStorage
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    //se o ID estiver no localStorage, tenta obter os dados do firestore
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId); // referecia ao doc do user no firestore

        getDoc(docRef) // busca o doc
        .then((docSnap) => {
            //se o docmento existir, exibe os dados na interface
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserLName').innerText = userData.lastName ? userData.lastName : "no last name";
                document.getElementById('loggedUserEmail').innerText = userData.email;
                userData.photoURL ? document.getElementById('loggedUserPhoto').src = userData.photoURL
                : document.getElementById('photo').innerText = "no photo"
            } else {
                console.log("ID não encontrado no Documento")
            }
        })
        .catch((error) => {
            console.log("Documento não encontrado:", error);
        });
    } else {
        console.log("ID de User não encontrado no localStorage");
    }
});

// Lógica de Logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId'); // remove o id do local storage
    signOut(auth) //faz o logout
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error logging out:', error)
    })
})