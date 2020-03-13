if (localStorage.getItem('user')) {
    $(".chat").show();
    $(".textarea").show();
    $(".jumbotron").hide();
}

// Realiza o cadastro no localstorage
$(".entrar").click(function() {
    var usuario = prompt('Digite o seu nome');
    localStorage.setItem('user', usuario);

    if (usuario != '' && usuario != null) {
        location.reload();
    } else {
        alert('Nome e E-mail é obrigatório para entrar!');
    }
});

firebase.initializeApp(config);

// Carrega as mensagens assim que a página é carregada
mensagens();

// Envia a mensagem para o Firebase
$("#textarea").keypress(function(e) {
    if (e.which == 13 && $("#textarea").val() != '') {
        var data = new Date();
        var body = {
            'user': localStorage.getItem('user'),
            'msg': $("#textarea").val(),
            'hora': data.getHours()+":"+data.getMinutes()
        }

        firebase.database().ref("chat").push(body);
        $("#textarea").val('');
        $("#textarea").focus();
        
        // Remove as divs mas mensagens
        $(".chat-area-interna").remove('.divMsg');
    }
});

// Busca as mensagens no firebase e monta os balões na view
function mensagens() {
    var ref = firebase.database().ref("chat");

    ref.on("child_added", function(snapshot) {
        var outroUsuario = false;
        if (snapshot.val().user != localStorage.getItem('user')) {
            outroUsuario = true;
        }
        
        if (outroUsuario) {
            var img = "<i class='fas fa-meh-rolling-eyes img_perfil outroUsuario'></i>";
        } else {
            var img = "<i class='fas fa-flushed img_perfil'></i>";
        }

        var hora = snapshot.val().hora+"h";
        var id = snapshot.key;

        var html = "";
        html += "<div class='divMsg'>";
      
        html += img;
        html += "<nomeUsuario>"+snapshot.val().user+"</nomeUsuario>";
        
        html += "<mensagem>"+snapshot.val().msg+"</mensagem>";
        html += "<hora>"+hora+"</hora>";
       
        html += "</div>";
        document.querySelector(".chat-area-interna").innerHTML += html;

        var div = $('.chat-area-interna');
        div.prop("scrollTop", div.prop("scrollHeight"));
    });
  }
