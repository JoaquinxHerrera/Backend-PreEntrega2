const formEdit = document.querySelector('form')
const inputs = document.querySelectorAll('input')

window.addEventListener('load', async event=>{
    console.log('la pagina se ha cargado correctamente')
    const response = await fetch('/api/sessions/current')
    if (response.status === 403){
        alert('You need to log in to modify your information')
        return (window.location.href = '/login')
    }
    
    const result = await response.json()
    console.log('Datos del usuario:', result)
    
    inputs[1].value = result.first_name
    inputs[2].value = result.last_name
    inputs[3].value = result.email
},

formEdit?.addEventListener('submit', async event => {
    event.preventDefault()

    const formData = {
        first_name: inputs[1].value,
        last_name: inputs[2].value,
        email: inputs[3].value
    }
    

    //@ts-ignore
    const body = new URLSearchParams(formData)

    const response = await fetch ('/api/users', {
        method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body
    })

    if (response.status === 200){
        const user = await response.json()
        alert(JSON.stringify(user))
        window.location.href = '/products'
    } else {
        const error = await response.json()
        alert(error.message)
    }
}))