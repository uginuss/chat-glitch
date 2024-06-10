const db=require('./database');
const http=require("http");
const path=require("path");
const fs=require("fs");

const {Server}=require('socket.io');

const cookie=require('cookie');
const { resolve } = require('url');





const pathtoindex=path.join(__dirname, 'static', 'index.html');
const indexhtmlfile=fs.readFileSync(pathtoindex);

const pathtoindexcss=path.join(__dirname, 'static', 'style.css');
const indexcssfile=fs.readFileSync(pathtoindexcss);

const pathtoindexjs=path.join(__dirname, 'static', 'script.js');
const indexjsfile=fs.readFileSync(pathtoindexjs);


const registerhtml=path.join(__dirname, 'static', 'register.html');
const registerfile=fs.readFileSync(registerhtml);

const regjs=path.join(__dirname, 'static', 'register.js');
const regjsfile=fs.readFileSync(regjs);

const loginhtml=path.join(__dirname, 'static', 'login.html');
const loginfile=fs.readFileSync(loginhtml);


const server=http.createServer((req, res)=>{
    if(req.method==='GET'){
        switch(req.url){
            // case '/' :  return res.end(indexhtmlfile);
            case '/style.css' :  return res.end(indexcssfile);
            case '/script.js' :  return res.end(indexjsfile);
            case '/register.js' :  return res.end(regjsfile);
            case '/register' :  return res.end(registerfile);
            case '/login' :  return res.end(loginfile);
            default: return guarded(req, res);
            
    
    
        }
    };
    if(req.method==='POST'){
        switch(req.url){
            case '/api/register' :  return registerUser(req,res);
            case '/api/login' :  return login(req,res);
    
            default: return guarded(req, res);    
    
    
        }
    };
    res.statusCode=404;
    return res.end('ERROR 404');



});



function guarded(req, res){
    const credentionals=getcredetionals(req.headers?.cookie);
    console.log(credentionals);
    if(!credentionals){
        res.writeHead(302, {'Location': '/register'});
        return res.end();
    }
    if(req.method==="GET"){
        switch(req.url){
            case '/': return res.end(indexhtmlfile);
            case '/script.js': return res.end(indexjsfile);
        }
    }
    res.writeHead(404);
    return res.end('Error 404');
};


function getcredetionals(c=''){
    const cookies=cookie.parse(c);
    const token = cookies?.token;
    if(!token || !validauthtoken.includes(token)) return null;
    const [user_id, login]=token.split('.');
    if(!user_id || !login) return null;
    return {user_id, login}
}













const validauthtoken=[];

function login(req, res){
    let data='';
    req.on('data', function(chunk){
        data+=chunk;
    });
    req.on('end', async function(){
        try{
            const user=JSON.parse(data);
            const token=await db.getauthtoken(user);
            validauthtoken.push(token);
            res.writeHead(200);
            res.end(token);
        }
        catch(e){
            res.writeHead(500);
            return res.end('Error: '+e);
        }
    });
}






function registerUser(req, res){
    let data='';
    req.on('data', function(chunk){
        data+=chunk;
    });
    req.on('end', async function(){
        try{
            const user=JSON.parse(data);
            if(!user.login || !user.pass){
                return res.end('Empty login or password');
            }
            if(await db.isuserexist(user.login)){
                return res.end('user existit, kish');
            }
            await db.adduser(user);
            return res.end('Register yes.');
        }catch(e){
            return res.end('Error:'+e);
        }
    });
}










server.listen(3000);





const io=new Server(server);


io.use((socket, next)=>{
    const cookie=socket.handshake.auth.cookie;
    const credentionals=getcredetionals(cookie);
    if(!credentionals){
        next(new Error('no auth'));
    }
    socket.credentionals=credentionals
    next();
});






io.on('connection', async (socket) => {
    console.log("id"+socket.id);

    let usernickname=socket.credentionals?.login;
    let userid=socket.credentionals?.user_id;






    socket.on('set_nickname', (nickname)=>{
        usernickname=nickname;
    });


    let messages=await db.getmessages();
    socket.emit('all_messages', messages);



    socket.on('new_message', (message)=>{
        db.addmessage(message, 1);
        io.emit('message', usernickname+':'+message);
    });
});