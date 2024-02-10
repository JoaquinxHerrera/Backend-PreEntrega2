let products = []

window.onload = updateProducts

async function updateProducts(){
    try{
        const products = await getProducts()
        showProducts(products)
    }catch(error){
        alert(error.message)
    }
}

async function getProducts(){
    const res = await fetch('/api/products')
    const obj = await res.json()
    products = obj.payload
    return products
}

function showProducts(products){
    //@ts-ignore
    document.querySelector('#productList').innerHTML =
    products.map(p => `- ${p.title} $${p.price}`).join('<br>')
}

const formAddProduct = document.querySelector('form')
formAddProduct?.addEventListener('submit', async event =>{
    event.preventDefault()

    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        //@ts-ignore
        body: new URLSearchParams(new FormData(formAddProduct))
    })

    if (response.status === 201){
        updateProducts()
    }else {
        const error = await response.json()
        alert(error.message)
    }
})