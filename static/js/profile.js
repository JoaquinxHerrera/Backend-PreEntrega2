const formLogout = document.querySelector('form')
const spans = document.querySelectorAll('span')

window.addEventListener('load', async () =>{
    const response = await fetch('/api/users/current')

    if (response.status === 403){
        alert('You need to log in to see your information')
        return (window.location.href = '/login')
    }
    
    const result = await response.json()
    const user = result.payload

    if (user) {
        spans[2].innerHTML = user.name ;
        spans[3].innerHTML = user.surname;
        spans[4].innerHTML = user.email ;
    } else {
        // Handle the case where user is null or undefined
        console.error('User data not available.');
        spans[2].innerHTML = 'admin';
        spans[3].innerHTML = 'admin';
        spans[4].innerHTML = 'admin';
    }
    
    const aLogout = document.getElementById('logout')
    aLogout.addEventListener('click', logout)
})


async function logout(event){    
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