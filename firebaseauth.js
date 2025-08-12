//importa as funções necessárias do firebase
import { initializeApp } from "";
import { getAuth, GoogleProvider, signInWithPopup, signOut, onAuthStateChaged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "";
import { getFirestore, setDoc, doc } from "";

//configuração do Firebase


//inicializa o firebase
const app = initializeApp(firebaseConfig);

//função para exibir mensagens temporárias na interface
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    message.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000); //a mensagem desaparece após 5 segundos
}

//lógia de cadastro de novos usuários
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault(); //previne o comportamento padrão do botão

    //adicionar os dados do formulário de cadastro
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth(); //configura o serviço de autenticação
    const db = getFirestore(); //conecta ao firestore

    //cria uma conta com e-mail e senha
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user; //usuário autenticado
        const userData = { email, firstName, lastName }; //dados do usuário para salvar

        showMessage('Conta criada com sucesso', 'signUpMessage'); //exibe mensagem de sucesso

        //salva os dados do usuário no firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then (() => {
            window.location.href = 'index.html'; //redireciona para a página de login após o cadastro
        })
        .catch((error) => {
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Endereço de email já existe', 'signUp');
        } else {
            showMessage('Não é possível criar usuário', 'signUpMessage');
        }
    });
});

//Lógica de login de usuários existentes
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault(); //previne o comportamente padrão do botão

    //adiciona os dados do formulário de login
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const auth = getAuth(); //configura o serviço de autenticação

    //realiza o login com e-mail e senha
})