const formLogout = document.querySelector('form')
const spans = document.querySelectorAll('p')




formLogout?.addEventListener('submit', async(event)=>{
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
})   
