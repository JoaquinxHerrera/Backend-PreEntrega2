import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../config/config";

export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 582,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});