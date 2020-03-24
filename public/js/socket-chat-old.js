var socket = io();

var params = new URLSearchParams(window.location.search);

if ( !params.has('name') || !params.has('room') ) {
    window.location = 'index.html';
    throw new Error ('The name and room is necessary');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function ( resp ) {
        renderUsers(resp);
    });
});


socket.on('createMessage', function (message) {
    console.log('Server: ', message);
    renderMessages ( message, false );
});

socket.on('peopleList', function ( people ) {
    renderUsers(people);
})

socket.on('privateMessage', function (message) {
    console.log('Private message', message);
})

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});
