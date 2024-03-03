// En un archivo de controlador de recuperación de contraseña:

import { fakeEmailService } from "../services/email/email.service.fake.js";
import { JWT_PRIVATE_KEY } from "../config.js";
import jwt from 'jsonwebtoken';

// Función para generar un token único
function generarToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Función para generar un token JWT
function generarTokenJWT(payload) {
  return jwt.sign(payload, JWT_PRIVATE_KEY, { expiresIn: '1h' });
}

async function solicitarRecuperacionContrasena(usuario, res) {
  const token = generarToken();
  const expiracion = Date.now() + 3600000; // 1 hora de expiración
  const tokenJWT = generarTokenJWT({ usuario, expiracion });
  
  // Guardar el token en la cookie
  res.cookie('resetPasswordToken', tokenJWT, { httpOnly: true, maxAge: 3600000 });
  
  const link = `https://localhost:8080/restablecer-contrasena?token=${token}`;
  const mensaje = `Hola ${usuario}, para restablecer tu contraseña, haz clic en el siguiente enlace: ${link}`;
  await fakeEmailService.send(usuario, 'Recuperación de Contraseña', mensaje);
}

async function restablecerContrasena(req, res) {
  const tokenJWT = req.cookies.resetPasswordToken;

  if (!tokenJWT) {
    return { success: false, message: 'El token no es válido' };
  }

  try {
    const { usuario, expiracion } = jwt.verify(tokenJWT, JWT_PRIVATE_KEY);

    if (expiracion < Date.now()) {
      res.clearCookie('resetPasswordToken');
      return { success: false, message: 'El token ha expirado' };
    }

    // Continuar con la lógica de restablecimiento de contraseña
    console.log(`Se ha restablecido la contraseña para ${usuario} a ${nuevaContrasena}`);
    res.clearCookie('resetPasswordToken');
    return { success: true, message: 'Contraseña restablecida con éxito' };
  } catch (error) {
    console.error(error);
    res.clearCookie('resetPasswordToken');
    return { success: false, message: 'Error al verificar el token' };
  }
}

export { solicitarRecuperacionContrasena, restablecerContrasena };