function carregarMensagens(quantidade) {

    var ref = firebase.database().ref("chat");
    ref.limitToLast(quantidade).orderByChild("user").once("value", function(snapshot) {

        snapshot.forEach(function(snapshot) {

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

            
        });
    });
}