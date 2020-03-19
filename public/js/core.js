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

var loading = "<center class='load'><h1 class='carregando'>Carregando Mensagens...</h1></center>";
loading += "<center class='load'><i class='fas fa-comment balaoLoad'></i></center>";
$(".chat-area-interna").html(loading);

// Carrega as mensagens assim que a página é carregada
mensagens();

// Remove o load
$(".load").hide();

// Mostra a ultima mensagem enviada pelo usuário
ultimaMensagemEnviadaPeloUsuario();

// Bipa se chegar mensagem nova
ultimaMensagemEnviadaPorQualquerUsuario();

// Envia a mensagem para o Firebase
$("#textarea").keypress(function(e) {
    if (e.which == 13 && $("#textarea").val() != '') {
        var data = new Date();
        var body = {
            'user': localStorage.getItem('user'),
            'msg' : $("#textarea").val(),
            'hora': data.getHours()+":"+data.getMinutes(),
            'dia' : data.getDay(),
            'data': data.getDate(),
            'mes' : data.getMonth(),
            'likes' : 0
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

    ref.limitToLast(30).on("child_added", function(snapshot) {
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
        
        if (snapshot.val().icone == undefined) {
            html += "<mensagem>"+snapshot.val().msg+"</mensagem>";
            
        } else {
            html += "<mensagem><i class='"+snapshot.val().icone+" mensagem-tipo-icone'></i></mensagem>";
        }

        // Verificar se a string é jpg ou png ou video ou audio...
        var file = snapshot.val().imagem;
        if (file !== undefined) {
            if (file.indexOf('mp3') != -1) {
                html += "<video controls='' autoplay='' name='media'><source src='"+snapshot.val().imagem+"' type='audio/mp3'></video>";
            } else {
                html += "<mensagem><img src='"+snapshot.val().imagem+"'/></mensagem>";
            }
        }
        
        var data = new Date();
        if (data.getDate() == snapshot.val().data) {
           html += "<hora>"+hora+" hoje</hora>";
        } else {
            html += "<hora>"+hora+" dia "+snapshot.val().data+"</hora>";
        }

        html += "</div>";
        document.querySelector(".chat-area-interna").innerHTML += html;
        
        // Abaixo o Scroll quando uma mensagem chega ou é enviada
        var div = $('.chat-area-interna');
        div.prop("scrollTop", div.prop("scrollHeight"));

        $('.curtir').each(function() {
            $(this).click(function() {
                var id = $(this).attr('id');

                var ref = firebase.database().ref("chat/"+id+"/likes");
                var atual = firebase.database().ref("chat/"+id);
                var likes = 0
                atual.once('value', function(snapshot) {
                    likes = snapshot.val().likes;
                });


                var dadosDoCurtir = {
                    'usuario': localStorage.getItem('user')
                }

                ref.push(dadosDoCurtir);

                //ref.update({likes:likes + 1});


            });
        });

    });
}

// Retorna a ultima mensagem enviada pelo usuário
function ultimaMensagemEnviadaPeloUsuario() {
    var ref = firebase.database().ref("chat");
    ref.orderByChild("user").equalTo(localStorage.getItem('user')).limitToLast(1)
    .on("child_added", function(snapshot) {

        var html = localStorage.getItem('user');
        html += ": <small>Ultima mensagem: " + snapshot.val().hora + "h";
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
            beep(5);
        } 
    });
}

// Mantem o container chat com a mesma altura do navegador
var altura = window.innerHeight;
document.querySelector(".chat").style.height = (altura - 109)+"px";
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

function beep(x) {
    var context = new AudioContext();
    var oscillator = context.createOscillator();
    var contextGain = context.createGain();
  
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);

    contextGain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + x)
}
