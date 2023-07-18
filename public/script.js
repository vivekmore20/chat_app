var socket = io();
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var parent = document.getElementById('connected');
var div1=document.getElementById('div1');
var div2=document.getElementById('div2');
var activeparent=document.getElementById('active-users')
const username=prompt("Enter username");
if(username==="" || username===null ){
    alert("Enter valid name");
    location.reload();
}
else{
    socket.emit('new-user',username);
    socket.on('user-exist',(data)=>{
        alert('Useer '+data+' exist');
        location.reload();
    });
}
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    if(parent.value==='Everyone'){
    socket.emit('chat message', {msg:input.value,self:username,userName:parent.value});
}
else{
    socket.emit('private message', {msg:input.value,self:username,userName:parent.value});
}
    input.value = '';
  }
});
socket.on('connected-user',(data)=>{
    parent.innerHTML = "";
   var op = document.createElement('option');
   op.innerText="Everyone";
   parent.appendChild(op);
   data.map((val,ind)=>{
    if(val!==username){
    var op = document.createElement('option');
   
    var active=document.createElement('div');
   
    active.innerText=val;
    op.innerText=val;
    activeparent.appendChild(active);
    parent.appendChild(op);
}
   });

});
socket.on('everyone chat', function(obj) {
    const sp=document.createElement('li');
    if(username===obj.self){
        sp.innerHTML="you"
    }else{
        sp.innerHTML=`from ${obj.self}`
    }
    messages.appendChild(sp);
    const  item = document.createElement('li');
    item.innerHTML =obj.msg ;
    messages.appendChild(item);
    sp.style.textAlign="right";
    sp.style.fontSize="10px";
    sp.style.backgroundColor="white";
   
    item.style.textAlign="right";
  window.scrollTo(0, document.body.scrollHeight);
});
socket.on('private message', function(obj) {
    const sp=document.createElement('li');
    if(username===obj.self){
        sp.innerHTML="you";
    }else{
        sp.innerHTML=`from ${obj.self}`
    } 
    messages.appendChild(sp);
    const item = document.createElement('li');
    item.textContent =obj.msg ;
    messages.appendChild(item);
    item.style.textAlign="right";
    sp.style.textAlign="right";
    sp.style.fontSize="10px";
    sp.style.backgroundColor="white";
    window.scrollTo(0, document.body.scrollHeight);
});

