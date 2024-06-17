const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


// Get username and room from URL
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
})

// join chatroom
socket.emit('joinRoom',{username,room})

//Get rooms and users
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
})

//console.log(username,room)

//Message from server
socket.on('message',message=>{
  console.log(message)
  OutputMessage(message)

  //Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight

  
})

// Message submit
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // message sending to server
  socket.emit('chatMessage',{username,room,msg})

  //Clear Input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

//Output message to DOM
function OutputMessage(message){
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>`
  document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user=> `<li>${user.username}</li>`).join('')}
  `
}


document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});