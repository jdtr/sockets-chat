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

    socket.emit('EnterChat', user, function ( resp ) {
        console.log(resp);
    });
});


socket.on('createMessage', function (message) {
    console.log('Server: ', message);
});

socket.on('peopleList', function ( people ) {
    console.log(people)
})

socket.on('privateMessage', function (message) {
    console.log('Private message', message);
})

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});
