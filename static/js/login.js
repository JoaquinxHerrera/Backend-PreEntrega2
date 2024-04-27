const formLogin = document.querySelector('form')

formLogin?.addEventListener('submit', async event =>{
    event.preventDefault()
    try {
      const response = await fetch('/api/sessions', {
          method: 'POST',
          headers:{'Content-Type': 'application/x-www-form-urlencoded'},
          // @ts-ignore
          body: new URLSearchParams(new FormData(formLogin))
      })
  
      if (response.status === 201){
          const sesion = await response.json();
          window.location.href='/products';
      } else {
          const error = await response.json()
          console.error(error)
          alert('Wrong email or password.')
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Se produjo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
})

async function resetPassword(token) {
    
          const sendEmail = await fetch('/api/sendResetEmail',{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
          })
          if(sendEmail.ok){
            alert('We have sent you an email to verify your identity! Please check your inbox to continue')
          }

    
}