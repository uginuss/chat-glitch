const registerform=document.getElementById('form_REG');

registerform?.addEventListener('submit', (event)=>{
    event.preventDefault();
    const {login, pass, reppass}=registerform;
    if(pass.value!==reppass.value){
        return alert('мамкин взломщик');
    }
    if((pass.value).length<8){
        return alert('ЧИТАЙ ДИСКЛЕЙМЕР');
    }
    const user=JSON.stringify({
        login:login.value,
        pass:pass.value
    });
    const xhr=new XMLHttpRequest();
    xhr.open('POST', '/api/register');
    xhr.send(user);
    xhr.onload=()=>alert(xhr.response);





});
const loginform=document.getElementById('form_log');

loginform?.addEventListener('submit', (event)=>{
    event.preventDefault();
    const {login, pass}=loginform;

    const user=JSON.stringify({
        login:login.value,
        pass:pass.value
    });
    const xhr=new XMLHttpRequest();
    xhr.open('POST', '/api/login');
    xhr.send(user);
    xhr.onload=()=>{
        if(xhr.status===200){
                const token=xhr.response;
                document.cookie=`token=${token}`;
                window.location.assign('/');
        }else{
            return alert(xhr.response);
        }
    };





});




































































// function filtr(){
//     console.log('kk');

//     setInterval(() => {
//         changecolor()
//     }, 10);
// };


// function changecolor(){

//     let x=Math.floor(Math.random() * 255);
//     let y=Math.floor(Math.random() * 255);
//     let z=Math.floor(Math.random() * 255);

//     console.log(x);
//     document.body.style.backgroundColor='rgb('+x+', '+y+', '+z+')';
// };