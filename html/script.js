// Variáveis globais
var socket;
var usernameInput;
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

// Inicialização do socket e dos elementos DOM
document.addEventListener("DOMContentLoaded", function() {
  // Inicialização do socket
  socket = io();

  // Referências aos elementos do DOM
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  dingSound = document.getElementById("Ding");

  // Evento de entrada na sala
  socket.on("join", function(room) {
    chatRoom.textContent = "Sala : " + DOMPurify.sanitize(room);
  });

  // Evento de recebimento de mensagem
  socket.on("recieve", function(message) {
    console.log(message);
    if (messages.length < 9) {
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      messages.shift();
      messages.push(message);
    }
    for (let i = 0; i < messages.length; i++) {
      document.getElementById("Message" + i).textContent = messages[i];
      document.getElementById("Message" + i).style.color = "#303030";
    }
  });
});

// Função chamada ao clicar no botão "Entrar"
window.Connect = function() {
  socket.emit("join", chatIDInput.value, usernameInput.value);
}

// Função chamada ao clicar no botão "Enviar"
window.Send = function() {
  if (delay && messageInput.value.replace(/\s/g, "") != "") {
    delay = false;
    setTimeout(delayReset, 1000);  // Configuração para evitar envio repetido
    socket.emit("send", messageInput.value);
    messageInput.value = "";  // Limpa a caixa de mensagem após enviar
  }
}

// Função para resetar o delay
function delayReset() {
  delay = true;
}
