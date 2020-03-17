var config = {
    apiKey: "AIzaSyDHzfFFVn2z3usKiwbLEyqb0m4bbO3Xmog",
    authDomain: "teste-chat-16f85.firebaseapp.com",
    databaseURL: "https://teste-chat-16f85.firebaseio.com",
    projectId: "iotssa-28bc8",
    storageBucket: "teste-chat-16f85.appspot.com",
    messagingSenderId: "G-K9C9PCBKFZ"
};

firebase.initializeApp(config);



var fileButton = document.querySelector('#img');
//var img = document.querySelector("#enviar_imagem");

fileButton.addEventListener('change', function(e) {
	var file = e.target.files[0];
	var storageRef = firebase.storage().ref('fotos/'+file.name);

	var task = storageRef.put(file);

})