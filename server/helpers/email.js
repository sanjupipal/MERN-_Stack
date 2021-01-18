exports.registerEmailParams = (email, token) =>{
    return  {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses:[email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `
                    <html>
                        <h1>Verify your email address</h1>
                        <p>Please use following link to complete your registration:</p>
                        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    </html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Complete your registration'
            }
        }
    };

}


exports.forgotPasswordEmailParams = (email, token) =>{
    return  {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses:[email]
        },
        ReplyToAddresses: [process.env.EMAIL_TO],
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `
                    <html>
                        <h1>Rest Password Link</h1>
                        <p>Please use following link to complete your registration:</p>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                    </html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Rest your Password'
            }
        }
    };

}

exports.linkPublishedParams = (email, data) =>{
    return  {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses:[email]
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html:{
                    Charset: 'UTF-8',
                    Data: `
                    <html>
                        <h1>New Link Published | site</h1>
                        <p>New link titled <b>${data.title}</b> has been just published in the following categ</p>
                        ${data.categories.map(c =>{
                            return `
                                <div>
                                    <h2>${c.name}</h2>
                                    <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                                    <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it out!</a></h3>
                                </div>
                            `
                        }).join('--------------')}
                        <br />
                        <p>Don not wish to receive notification?</p>
                        <p>you can turn it of from dashboard->update->uncheck the categories</p>
                        <p>${process.env.CLIENT_URL}/user/profile/update</p>
                    </html>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'New link published'
            }
        }
    };

}
