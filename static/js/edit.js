const formEdit = document.querySelector('form')
const inputs = document.querySelectorAll('input')

window.addEventListener('load', async event=>{
    const response = await fetch('/api/users/current')
    if (response.status === 403){
        alert('You need to log in to modify your information')
        return (window.location.href = '/login')
    }
    
    const result = await response.json()
    const user = result.payload

    inputs[1].value = user.name
    inputs[2].value = user.surname
    inputs[3].value = user.email
},

formEdit?.addEventListener('submit', async event => {
    event.preventDefault()

    const formData = new FormData(formEdit)
    formData.append('email', inputs[3].value)

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