const formLogout = document.querySelector('form')
const btnSwitchRole = document.querySelector('.switchRole')
const spans = document.querySelectorAll('span')

window.addEventListener('load', async () =>{
    const response = await fetch('/api/sessions/current')

    if (response.status === 403){
        alert('You need to log in to see your information')
        return (window.location.href = '/login')
    }
    
    const result = await response.json()
    const user = result.payload  
    
    const aLogout = document.getElementById('logout')
    aLogout.addEventListener('click', logout)
})
async function resetPassword(token) {
    
        try{
          const sendEmail = await fetch('/api/sendResetEmail',{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
          })
          if(sendEmail.ok){
            alert('We have sent you an email to verify your identity! Please check your inbox to continue')
          }
        } catch(error){
          console.log(error.message)
        }
      

    
}

async function logout(event){    
    event.preventDefault()
    const response = await fetch('/api/sessions/current', {
        method: 'DELETE',
    })

    if (response.status === 200){
        window.location.href='/login';
    } else {
        const error = await response.json()
        alert(error.message)
    }
}

async function switchRole() {
  try {
    const response = await fetch("api/users/current");
    if (!response.ok) {
      throw new Error("Failed to get user data");
    }

    const user = await response.json();
    const userId = user.payload._id;
    const roleSwitch = await fetch(`/api/users/premium/${userId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!roleSwitch.ok) {
      throw new Error("Failed to switch role");
    }
    const role = await roleSwitch.json();
    alert("Your rol has changed, if you don't see the changes please login again");
    return role;
  } catch (error) {
      return null;
  }
}

