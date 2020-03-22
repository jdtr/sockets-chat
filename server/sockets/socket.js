const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

   client.on('enterChat', (data, callback) => {
    console.log(data)

    if ( !data.name || !data.room ) {
        return callback ({
            error: true,
            message: 'The name/room is necessary'
        })
    }

    client.join(data.room)
    users.addPeople(client.id, data.name, data.room);

    client.broadcast.to(data.room).emit('peopleList', users.getPeoplePerRoom(data.sala));

    callback(users.getPeoplePerRoom(data.room));
   });

   client.on('createMessage', (data) => {
       let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
   });

   client.on('disconnect', () => {
       let deletePerson = users.deletePerson(client.id);

       client.broadcast.to(deletePerson).emit('createMessage', createMessage('Admin', `${ deletePerson } has left the chat`))
       client.broadcast.to(deletePerson).emit('peopleList', users.getPeoplePerRoom(deletePerson.room));
    });

    client.on('privateMessage', data => {
        let person = users.getPerson(client.id);
        client.broadcast.to(data.for).emit('privateMessage', createMessage(person.name, data.message))
    })

});