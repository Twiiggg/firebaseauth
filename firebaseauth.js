//importa as funções necessárias do firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChaged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

//configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRQeyouhQeqjTPjOai3immdRVvqrkjEWA",
    authDomain: "fireopenid.firebaseapp.com",  
    projectId: "fireopenid",  
    storageBucket: "fireopenid.firebasestorage.app",  
    messagingSenderId: "874472237952",
    appId: "1:874472237952:web:ef8868c05e3d5affa82f65"
  };
// Inicializa o firebase
const app = initializeApp(firebaseConfig);
 
// Função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); //A mensagem desaparece após 5 segundos
}
 
// Lógica de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); //Previne o comportamento padrão do botão
 
    // Adicionar os dados do formulário de cadastro
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
    const firstName = document.getElementById("fName").value;
    const lastName = document.getElementById("lName").value
 
    const auth = getAuth(); // Configura o serviço de autenticação
    const db = getFirestore();
 
    // Cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user; //Usuário Autenticado
        const userData = { email, firstName, lastName}; // Dados do usuário para salvar
        console.log("TESTESTESTSTSETES")
        showMessage("Conta criada com sucesso", "signUpMessage"); // Exibe mensagem de sucesso
 
        //Salva os dados do usuário no Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            window.location.href = "index.html"; // Redireciona para a página de login após o cadastro
        })
        .catch((error) => {
            console.error("Erro writing document", error);
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/email-already-in-use") {
            showMessage("Endereço de email já existe")
        } else {
            showMessage("Não é possível criar usuário", "signUpMessage");
        }
    });
});
 
// Lógica de login de usuários existentes
 
const signIn = document.getElementById("submitSignIn");
signIn.addEventListener("click", (event) => {
    event.preventDefault(); // Previne o comportamento padrão do botão
 
    // Adiciona os dados do formulario de login
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth(); // Configura o serviço de autenticação
 
    // Realiza o login com e-mail e senha
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        showMessage("Usuário logado com sucesso", "signInMessage"); // Exibe mensagem de sucesso
        const user = userCredential.user;
 
        // Salva o ID do usuário no localStorage
        localStorage.setItem("loggedInUserId", user.uid);
        console.log("USER UID: " + user.uid)
 
        window.location.href = "homepage.html"; //Redireciona para a página inicial
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
            showMessage("Email ou Senha incorreta", "signInMessage");
        } else {
            showMessage("Essa conta não existe", "signInMessage")
        }
    });
});