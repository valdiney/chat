// Se não existir usuario no localStorage, mostra a div de cadastro
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

// Mostra a ultima mensagem enviada pelo usuário
ultimaMensagemEnviadaPeloUsuario();

ultimaMensagemEnviadaPorQualquerUsuario();

// Envia a mensagem para o Firebase
$("#textarea").keypress(function(e) {
    if (e.which == 13 && $("#textarea").val() != '') {
        var data = new Date();
        var body = {
            'user': localStorage.getItem('user'),
            'msg' : $("#textarea").val(),
            'hora': data.getHours()+":"+data.getMinutes(),
            'dia' : data.getDate(),
            'mes' : data.getMonth()
        }

        if ($("#textarea").val().length > 2) {
            firebase.database().ref("chat").push(body);
        } else {
            console.log('Digite algo...');
        }
    
        $("#textarea").val('');
        $("#textarea").focus();
        
        // Remove as divs das mensagens
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
        if ( ! outroUsuario) {
           html += "<div class='divMsg divMsgEu'>";
        } else {
            html += "<div class='divMsg'>";
        }
        
        html += img;
        html += "<nomeUsuario>"+snapshot.val().user+"</nomeUsuario>";
        
        html += "<mensagem>"+snapshot.val().msg+"</mensagem>";
        html += "<hora>"+hora+"</hora>";
       
        html += "</div>";
        document.querySelector(".chat-area-interna").innerHTML += html;
        
        // Abaixo o Scroll quando uma mensagem chega ou é enviada
        var div = $('.chat-area-interna');
        div.prop("scrollTop", div.prop("scrollHeight"));

    });
}

// Retorna a ultima mensagem enviada pelo usuário
function ultimaMensagemEnviadaPeloUsuario() {
    var ref = firebase.database().ref("chat");
    ref.orderByChild("user").equalTo(localStorage.getItem('user')).limitToLast(1)
    .on("child_added", function(snapshot) {

        html = localStorage.getItem('user');
        html += " <small>Ultima mensagem: " + snapshot.val().hora + "h";
        html += " de " + mesesPorExtenso(snapshot.val().mes) + "</small>";

        $("tituloNomeUsuario").html(html);
       
    });
}

function ultimaMensagemEnviadaPorQualquerUsuario() {
    var ref = firebase.database().ref("chat");
    ref.limitToLast(1)
    .on("child_added", function(snapshot) {
        // Bipa
        if (snapshot.val().user != localStorage.getItem('user')) {
            beep(999, 220, 300);
        } 
    });
}

// Mantem o container chat com a mesma altura do navegador
var altura = window.innerHeight;
document.querySelector(".chat, .chat-area-interna").style.height = (altura - 64)+"px";
document.querySelector(".chat-area-interna").style.height = (altura - 90)+"px";

// Contem os mesmes por extenso
function mesesPorExtenso(mes) {
    $arrayMes = [
        'Janeiro',
        'Ferereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];
    
    if (mes == 1) {
        mes = 0;
    }

    return $arrayMes[mes];
}






function teste() {
    var ref = firebase.database().ref("chat");
    ref.orderByChild("user").equalTo(localStorage.getItem('user')).on("child_added", function(snapshot) {
      console.log(snapshot.val().msg);
    });
}






// Emite um Beep
a=new AudioContext()
function beep(vol, freq, duration){
  v=a.createOscillator()
  u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}
