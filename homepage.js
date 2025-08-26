//importa as funções necessárias do firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

//configuração do firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRQeyouhQeqjTPjOai3immdRVvqrkjEWA",
    authDomain: "fireopenid.firebaseapp.com",  
    projectId: "fireopenid",  
    storageBucket: "fireopenid.firebasestorage.app",  
    messagingSenderId: "874472237952",
    appId: "1:874472237952:web:ef8868c05e3d5affa82f65"  
  };

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
        const docRef = doc(db, "Users", loggedInUserId); // referecia ao doc do user no firestore

        getDoc(docRef) // busca o doc
        .then((docSnap) => {
            //se o docmento existir, exibe os dados na interface
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserEmail').innerText = userData.email;
                document.getElementById('loggedUserLName').innerText = userData.lastName;
            } else {
                console.log("ID não encontrado no Documento")
            }
        })
        .catch((error) => {
            console.log("Documento não encontrado");
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
        window,location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error logging out:', error)
    })
})