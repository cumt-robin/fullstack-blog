const nodemailer = require('nodemailer');
const config = require('../config');

function EmailHandler() {
    this.config = Object.assign({}, config.email)
    this.transporter = nodemailer.createTransport(this.config);
}

EmailHandler.prototype.sendEmail = function (mailOptions) {
    return new Promise((resolve, reject) => {
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                console.log('Message sent: %s', info.messageId);
                resolve(info)
            }
        });
    })
}

EmailHandler.prototype.replyEmailForMessage = function (email, wd = "留言", msgContent, visitUrl) {
    const mailOptions = {
        from: `"${config.blogName}" <${config.email.auth.user}>`,
        to: email,
        subject: `${config.blogName}《${wd}审核通过通知》`, // 主题
        html: `<h1 style="text-align:center;color:#409EFF">感谢您在<a href="${visitUrl}">${config.blogName}</a>留下足迹</h1>\
        您的${wd}<strong style="display:block;font-size:18px">${msgContent}</strong>已经审核通过，请点击<a href="${visitUrl}" style="font-size:18px">${config.blogName}</a>前往查看`
    };
    this.sendEmail(mailOptions).then(info => {
        console.log(`${wd}通过邮件发送成功`, info)
    }, error => {
        console.log(`${wd}通过邮件发送失败`, error)
    })
}

const emailHandler = new EmailHandler();

module.exports = emailHandler;