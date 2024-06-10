const socket=io({
    auth: {
        cookie: document.cookie
    }
});

const form=document.getElementById('form');

form.addEventListener('submit', function(e){
    e.preventDefault();

    let input=document.getElementById('text');



    if(input.value){
        socket.emit('new_message', input.value);
        input.value='';
    };
});

let chat=document.getElementById('chat');


socket.on('message', function(msg){

    let item=document.createElement('div');
    item.classList.add('chat_h3');
    item.textContent=msg;

    chat.appendChild(item);



    chat.scrollTo(0, chat.scrollHeight);



});


function changenickname(){
    let nickname=prompt('Choose your nickname');
    if(nickname){
        socket.emit('set_nickname', nickname);
    }
};



socket.on('all_messages', function(msgarray){
    msgarray.forEach(msg => {
        let item=document.createElement('div');
        item.classList.add('chat_h3');
        item.textContent=msg.login+':'+msg.content;

        chat.appendChild(item);
        chat.scrollTo(0, chat.scrollHeight);
    });
})