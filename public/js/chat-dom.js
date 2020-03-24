const paramsUrl = new URLSearchParams(window.location.search);
const divUsers = document.getElementById("divUsers");
const formSend = document.getElementById("form-send");
const txtMessage = document.getElementById("txt-message");
const divChatbox = document.getElementById("divChatbox");

let name = paramsUrl.get('name');
let room = paramsUrl.get('room');

function renderUsers ( people ) {
    console.log(people);
    let i;
    let html = `<li>
        <a href="javascript:void(0)" class="active"> Chat from <span> ${ paramsUrl.get("room") }</span></a>       
    </li>`;

    for ( i = 0; i < people.length; i++ ) {
        html += `<li>
            <a  data-id="${ people[i].id }" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${ people[i].name }<small class="text-success">online</small></span></a>
        </li>`;
    }


    divUsers.innerHTML = html;
}

function renderMessages ( message, me ) {

    let html = '';
    let date = new Date(message.date);
    let hour = date.getHours() + ':' + date.getMinutes();
    let adminClass = 'info';

    let liDom = document.createElement("li");

    if ( message.name === "Admin" ){
        adminClass = 'danger';
    }

    if ( me ) {
        liDom.setAttribute("class", "reverse animated fadeInRight");

        liDom.innerHTML += `
                <div class="chat-content">
                    <h5>${ message.name }</h5>
                    <div class="box bg-light-inverse">${ message.message }</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${ hour }</div>`;
    } else {
        liDom.setAttribute("class", "animated fadeInLeft");

        if ( message.anme === 'Admin' ) {
            liDom.innerHTML += `<div class="chat-img">
                <img src="assets/images/users/1.jpg" alt="user" /></div>`; 
        }

        liDom.innerHTML += `<div class="chat-content">
                <h5>${ message.name }</h5>
                <div class="box bg-light-${ adminClass }">${ message.message }</div>
            </div>
            <div class="chat-time">${ hour }</div>`;
    }

    divChatbox.appendChild(liDom);
}


divUsers.addEventListener("click", function (e) {
    console.log(e.target.getAttribute("data-id"))
});

formSend.addEventListener('submit', (e) => {
    e.preventDefault();

    if ( txtMessage.value.trim().length === 0 ) {
        return;
    }

    socket.emit('createMessage', {
        name: name,
        message: txtMessage.value
    }, function (message) {
        txtMessage.value = "";
        txtMessage.focus();
        renderMessages ( message, true );
        scrollBottom ()
        console.log('Respuesta server:', message)
    })
});