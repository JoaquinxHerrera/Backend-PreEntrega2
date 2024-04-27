import { gmailEmailService } from "../services/email.service.js"


export async function sendResetEmailController(req, res){
    try{
        await gmailEmailService.send(
            req.user.email,
            "Reset your password",
            `<div>
                <h1>Click on the button and set your new password!</h1>
                <a href="http://localhost:8080/resetpassword">
                    <button>
                        Reset password
                    </button>
                </a>
            </div>
            `
        )
        return res.status(200).send("Email sent")
    } catch(error){
        return res.status(500).send(error.message)
    }
}

export async function sendDeleteMailController(ownerEmail, deletedProduct){
    try {
        await gmailEmailService.send(
            ownerEmail,
            "One of your products was deleted",
            `<div>
                <h1>Hi there!</h1>
                <p>Your product with ID: ${deletedProduct._id} has been deleted!</p>
            </div>
            `
        )
    } catch (error) {
        console.error("Error sending delete email:", error)
        throw new Error("Failed to send delete email")
    }
}