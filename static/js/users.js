async function switchUsersRole(userId) {
    try {
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
      alert("User role has been changed successfully");
      window.location.reload()
      return role;
    } catch (error) {
        return null;
    }
}

async function deleteUser(userId){
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        })
        if(!response.ok){
            throw new Error('Failed to delete user')
        }
        alert("User has been deleted successfully");
        window.location.reload()
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

async function deleteInactiveUsers(){
    try {
        const response = await fetch('/api/inactive',{
            method: 'DELETE'
        })
        if(!response.ok){
            throw new Error('Failed to delete users')
        }
        alert("Users have been sucessfully deleted")
        window.location.reload()
    } catch (error) {
        console.error(error)
        return false
    }
}