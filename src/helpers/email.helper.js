const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cassie.rohan@ethereal.email',
        pass: '6nQ73b6S41vvgJ26RC'
    }
});  

const send =  (info) => {

    return new Promise(async(resolve, reject) => {

        try {
            // send mail with defined transport object
            let result = await transporter.sendMail(info);

            console.log("Message sent: %s", result.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
            resolve(result)
        } catch (error) {
            console.log(error);
        }
    })
    



};



const emailProcessor = (email, pin) => {
    const info = {
        from: '"Luccas CRM" <cassie.rohan@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password reset pin", // Subject line
        text: "Here is your password reset Pin" + pin + "this pin will expires in 1 day", // plain text body
        html: `<b>Hello</b>
        Here is you PIN
        <b>${pin}</b>
        This PIN will expires in 1 day
        `, // html body
    }

    send(info, )
};

module.exports = {
    emailProcessor,
}