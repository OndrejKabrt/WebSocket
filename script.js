const socket = io();
const editorContainer = document.getElementById('editorContainer');
const connectedUsers = document.getElementById('connectedUsers');

let cursor;
let username;
let userid;


document.getElementById('join').onclick = function() {
username = document.getElementById('username').value;
    if (username) {
        socket.emit('new user', username);
        const inputfield = document.getElementById("username");
        inputfield.remove();
        const button = document.getElementById("join");
        button.remove();
        socket.emit('connect');


    }
};


editorContainer.addEventListener('input', () => {
    socket.emit('text change', { text: editorContainer.innerText });
});


socket.on('document update', (text) => {
    editorContainer.innerText = text;
});


socket.on('user list', (users) => {
    connectedUsers.innerHTML = 'Připojení uživatelé: ' + users.map(user => user.name).join(', ');
});


socket.on('connect', () => {
    status.innerText = 'Připojeno ke serveru';
});


socket.on('disconnect', () => {
    status.innerText = 'Odpojeno od serveru';
});


socket.on('create cursor', (data) => {
    createcursor(data.userid)
})


editorContainer.addEventListener('mousemove', (event) => {
    cursor.style.left = event.clientX + 'px';
    cursor.style.top = event.clientY + 'px';
    cursor.style.display = 'block';
    socket.emit('cursor update', { position: { x: event.clientX, y: event.clientY } });
});


socket.on('cursor update', (data) => {
    cursor = document.getElementById(data.userid);
    cursor.style.left = data.position.x + 'px';
    cursor.style.top = data.position.y + 'px';
    cursor.style.display = 'block';
});

function createcursor(id){
    const newDiv = document.createElement("div");
    document.body.appendChild(newDiv);
    if (!id){
        colour = generate_colour();
        newDiv.className = "cursor";
        newDiv.style["background-colour"]= colour;
        newDiv.setAttribute('id',colour);
        userid = colour;
    }else{
        newDiv.className = "cursor";
        newDiv.style["background-colour"]= colour;
        newDiv.setAttribute('id',colour);
    }
}


//Z kodu Adama Hlavačika
function generate_colour(){
    var letters = "0123456789ABCDEF"; 
    var color = '#';
    for(let i = 0; i<6;i++){
        color += letters[(Math.floor(Math.random() * 16))]; 
    }
    console.log(color);
    return color;
}