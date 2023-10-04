const btnAddGroup = document.getElementById('btngroup');
const btnSend = document.getElementById('send')

const msgInput = document.getElementById('msginput')
const groupNameInput=document.getElementById('groupNameInput');
const btnCreateGroup = document.getElementById('createGroup');
const groupname = document.getElementById('groupname')
const inputdiv = document.getElementById('inputdiv')

const groupList = document.getElementById('grouplist')
const messageList = document.getElementById('messagelist')

const URL = 'http://localhost:3000'
const token = localStorage.getItem('token');
const username =localStorage.getItem('username')


btnSend.onclick=async()=>{
    const message = msgInput.value;
    msgInput.value='';
    const obj = {
        message:message,
        username:username,
        groupname:groupNameInput.value
    }
    const res = await axios.post(`${URL}/chat/sendmessage`,obj,{headers:{Authorization:token}})
    showMessages(obj)

}

function showMessages(obj){
    const div = document.createElement('div')
    if(obj.username === username){
        div.textContent=obj.message;
        div.className='list-group-item text-end'
    }else{
        div.textContent=`${obj.username}:-${obj.message}`;
        div.className='list-group-item'
    }
    messageList.appendChild(div);
}



btnCreateGroup.onclick= async() =>{
    try {
        const obj = {
            groupname:groupNameInput.value,
            username:username
        }
        console.log(obj)
        groupNameInput.value=''
       const res=await axios.post(`${URL}/chat/creategroup`,obj,{headers:{Authorization:token}})
        showgroups(obj)
        
    } catch (error) {
        console.log(error)
    }
}

         
async function showgroups(obj){
    const h3 = document.createElement('h3');
    h3.classList='bg-warning'
    document.getElementById('addGroupMember').addEventListener('click',async()=>{
        try {
            const emailinput = document.getElementById('groupMemberEmailInput')
            const obj = {
                email:emailinput.value,
                groupname:groupname.textContent,
                username:username,
            }
    
            const res=await axios.post(`${URL}/chat/addgroupmember`,obj,{headers:{Authorization:token}})
            
        } catch (error) {
            if(error.response.status === 404){
                alert(error.response.data.message)
            }
            
        }
    })
    h3.innerHTML=`
    <button class="btn d-inline"><h3 id='btngroupname' >${obj.groupname}</h3></button>
    <div class="dropdown d-inline">
    <button class=" btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    ⋮
    </button>
    <ul class="dropdown-menu">
      <li><a class=" btn dropdown-item" id="" data-bs-toggle="modal" data-bs-target="#addGroupMemberModal">add member</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
  `
  groupList.appendChild(h3)
  const groupname = document.getElementById('btngroupname')
  groupname.addEventListener('click',async()=>{
    try {
        
        inputdiv.classList.remove('hidden')
        groupNameInput.value=groupname.textContent
        const groupnameparams=groupname.textContent
  
        const response=await axios.get(`${URL}/chat/getallmessages/${groupnameparams}`,{headers:{Authorization:token}})
        messageList.innerHTML=''
        const messages = response.data.messages
        for(let i=0; i<messages.length; i++){
          showMessages(messages[i])
        }
    } catch (error) {
        console.log(error)
    }

  })
}

window.addEventListener('DOMContentLoaded', getgroups)

async function getgroups(){
    try {
        const res = await axios.get(`${URL}/chat/getallgroups`,{headers:{Authorization:token}});
        const groups=res.data.groups
        
        for(let i=0; i<groups.length;i++){
            showgroups(groups[i])
        }
        
    } catch (error) {
        console.log(error)
    }
}
