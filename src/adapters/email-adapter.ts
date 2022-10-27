import nodemailer from "nodemailer";

export const emailAdapter = {
    sendMail: async (email: string,
               message: string,
               subject: string) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "genafesenko1985@gmail.com",
                pass: "pzmcieotsbfirksl",
            },
        });

        // send mail with defined transport object
        return await transporter.sendMail({
            from: '"Gena 👻" <genafesenko1985@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
        })
    }
}