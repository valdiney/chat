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
var uploader = document.querySelector("#uploader");

fileButton.addEventListener('change', function(e) {
	var file = e.target.files[0];
	var storageRef = firebase.storage().ref('fotos/'+file.name);

	var task = storageRef.put(file);

	task.on('state_changed', 

		function progress(snapshot) {
			var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			uploader.value = percentage;
		},

		function error(err) {

		},

		function complete() {
			cadastrarImagem(file.name);

		}

	);
});

function cadastrarImagem(imagemName) {
	var data = new Date();
    var body = {
        'user': localStorage.getItem('user'),
        'msg' : $("#textarea").val(),
        'hora': data.getHours()+":"+data.getMinutes(),
        'dia' : data.getDay(),
        'data': data.getDate(),
        'mes' : data.getMonth(),
        'likes' : 0,
        'imagem' : "https://firebasestorage.googleapis.com/v0/b/teste-chat-16f85.appspot.com/o/fotos%2F"+imagemName+"?alt=media&token=752d1b28-0c17-4e76-8996-a7460c0c91ea"
    }

    firebase.database().ref("chat").push(body);
}



 /*var storageRef = firebase.storage().ref('files/fotos');
 var spaceRef = storageRef.child('1584413807633-1918088649.jpg');
 var path = spaceRef.fullPath*/



