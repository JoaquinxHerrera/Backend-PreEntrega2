import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 582,
  secure: false,
  auth: {
    user: "joaquin.xherrera1@gmail.com",
    pass: "contrasenaprueba",
  },
});