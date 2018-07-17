const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: "hzk@cherryml.com",
        pass: "mnpcebysunjpbjjd"
    }
})

module.exports={
    mailOptions : {
        from: "hzk@cherryml.com",
        to: "",
        subject: "",
        html: ""
    },
    sendMail:function(){
        transporter.sendMail(this.mailOptions, (err, info) => {
            if (err) {
                console.log(err)
                return;
            }
            console.log("info:", info)
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getMessageUrl(info));
        })
    },
    initReplyHtml:(mailObject) => {
        let { blogName, replyNickNameTo, articleTitle, oldComment, newreplyNickName, newComment, articleUrl } = mailObject
        return (
            `<table border = "1" cellpadding = "0" cellspacing = "0" width = "600" align = "center" style = "border-collapse: collapse; border-style: solid; border-width: 1;border-color:#ddd;" >
            <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" height="48" >
                            <tbody><tr>
                                <td width="100" align="center" style="border-right:1px solid #ddd;">
                                    <a href="https://cherryml.com" target="_blank">${blogName}</a></td>
                                <td width="300" style="padding-left:20px;">
                                    <strong>您有一条来自 <a href="https://cherryml.com" target="_blank" style="color:#6ec3c8;text-decoration:none;">${blogName}</a> 的回复</strong></td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:15px;">
                        <p><strong>${replyNickNameTo}</strong><span>, 你好!</span></p>
                        <p>你在《${articleTitle}》的留言:</p>
                        <p style="border-left: 3px solid #ddd;color: #999;background-color: #f5f5f5;padding: 10px 15px;">
                            ${oldComment}
                        </p>
                        <p><strong>${newreplyNickName}</strong> 给你的回复:</p>
                        <p style="border-left: 3px solid #ddd;color: #999;background-color: #f5f5f5;padding: 10px 15px;">
                            ${newComment}
                        </p>
                        <center><a href="${articleUrl}" target="_blank" style="background-color:#6ec3c8; border-radius:10px; display:inline-block; color:#fff; padding:15px 20px 15px 20px; text-decoration:none;margin-top:20px; margin-bottom:20px;">点击查看完整内容</a></center>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="center" height="38" style="font-size:0.8rem; color:#999;">Copyright © ${blogName}</td>
                </tr>
            </tbody>
        </table >`
        )
    },
    initCommmentHtml: (newCommentObject) => {
        let { blogName, articleTitle, ip, website, email, comment, articleUrl, newreplyNickName } = newCommentObject
        return (
            `<table border = "1" cellpadding = "0" cellspacing = "0" width = "600" align = "center" style = "border-collapse: collapse; border-style: solid; border-width: 1;border-color:#ddd;" >
            <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" height="48" >
                            <tbody><tr>
                                <td width="100" align="center" style="border-right:1px solid #ddd;">
                                    <a href="https://cherryml.com" target="_blank">${blogName}</a></td>
                                <td width="300" style="padding-left:20px;">你的文章《${articleTitle}》有新留言:</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:15px;">
                       	<p>昵称: ${newreplyNickName}</p>
                        <p>IP: ${ip}</p>
                        <p>网站: <a href="${website}" target="_blank">${website}</a></p>
                        <p>邮箱: <a href="mailto:${email}" target="_blank">${email}</a></p>
                        <p style="border-left: 3px solid #ddd;color: #999;background-color: #f5f5f5;padding: 10px 15px;">
                            ${comment}
                        </p>
                        <center><a href="${articleUrl}" target="_blank" style="background-color:#6ec3c8; border-radius:10px; display:inline-block; color:#fff; padding:15px 20px 15px 20px; text-decoration:none;margin-top:20px; margin-bottom:20px;">点击查看完整内容</a></center>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="center" height="38" style="font-size:0.8rem; color:#999;">Copyright © 柠檬酸</td>
                </tr>
            </tbody>
        </table >` )
    }
}


