async function checkout(cartId){
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`)
        if(!response.ok){
            throw new Error('Failed to checkout')
        }
        alert("Purchase successful");
        window.location.href='/products';
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
async function clearCart(cartId){
    try {
        const response = await fetch(`/api/carts/${cartId}/`, {
            method: 'DELETE',
        })
        if(!response.ok){
            throw new Error('Failed to clear cart')
        }
        window.location.reload()
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}
async function deleteItem(cartId, productId){
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE',
        })
        if(!response.ok){
            throw new Error('Failed to delete item')
        }
        window.location.reload()
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}