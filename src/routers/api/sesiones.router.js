import { Router } from "express";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config.js";
import { userManager } from "../../models/User.js";

export const sesionesRouter = Router()

sesionesRouter.post('/', async(req,res)=>{
    const { email, password } = req.body;

    // Validar si el usuario es administrador
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session['user'] = {
            email: ADMIN_EMAIL,
            rol: 'admin'
        };
        return res.status(201).json({ status: 'success', payload: req.session['user'] });
    }

    // Si no es administrador, buscar en la base de datos
    const user = await userManager.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ status: 'error', message: 'Wrong email or password' });
    }

    // Usuario encontrado en la base de datos
    req.session['user'] = {
        name: user.name,
        surname: user.surname,
        email: user.email,
        rol: 'user'
    };

    res.status(201).json({ status: 'success', payload: req.session['user'] });
});

sesionesRouter.delete('/current', (req,res)=>{
    req.session.destroy(err =>{
        res.status(204).json({status: 'success'});
    });
});