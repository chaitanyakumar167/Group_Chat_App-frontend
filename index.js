const btnSignup = document.getElementById('signup');
const btnLogin = document.getElementById('login');

const label = document.getElementById('label')

// input elements
const signupUserName = document.getElementById('username')
const signupEmailId = document.getElementById('email')
const signupNumber = document.getElementById('number')
const signupPassword = document.getElementById('password')
const loginEmailId = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword')

const URL = 'http://localhost:3000'

btnSignup.addEventListener('click',async(e)=>{
    e.preventDefault();
    try {
        const userObj = {
            name:signupUserName.value,
            email:signupEmailId.value,
            number:signupNumber.value,
            password:signupPassword.value
        }
        if(signupEmailId.value === '' || signupPassword.value === '' || signupUserName.value === '' || signupNumber.value === ''){
            alert('missing input field')
            return;
        }
    
        const response = await axios.post(`${URL}/user/signup`,userObj)
        signupEmailId.value='';
        signupPassword.value='';
        signupNumber.value='';
        signupUserName.value='';

        if(response.status === 201){
            label.click()
        }else{
            throw new Error({message:'something went wrong'})
        }

        
    } catch (error) {
        if(error.response.request.status === 409){
            showError(error.response.data.message)
        }else{
        showError(error.message)
        }
    }
})

function showError(error){
    return document.body.innerHTML += `<div style='color:white;'>${error}</div>`;

}

btnLogin.addEventListener('click',async(e)=>{
    e.preventDefault()
    try {
        const userObj = {
            email:loginEmailId.value,
            password:loginPassword.value,
        }
        if(loginEmailId.value === ''|| loginPassword.value=== ''){
            alert('missing input field')
            return;
        }
        const res = await axios.post(`${URL}/user/login`,userObj)
        if(res.status===200){
            localStorage.setItem('token',res.data.token)
            window.location.href='../chat/index.html'
        }
    } catch (error) {
        if(error.response.status === 404 || error.response.status === 401){
            showError(error.response.data.message)
        }else{

            showError(error.message)
        }
    }
})

