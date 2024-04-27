async function addToCart(productId) {    
    const response = await fetch('/api/sessions/current')
    const result = await response.json()

    try{
        const cartId = result.cart; 
        if(!cartId){
            alert("Log in to add products to cart")
            return
        }
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId,
            }),
        })
        Toastify({
            text: "Product added to cart!",
            duration: 3000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                padding: "0.3em 1em",
                
            },
        }).showToast();
                
    }catch(error){
        alert("Failed to add product to cart")
        throw error;
    } 
}
   