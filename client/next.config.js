const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    publicRuntimeConfig:{
        APP_NAME: 'NODE-REACT-AWS',
        API: '/api',
        PRODUCTION: true,
        DOMAIN: 'http://ec2-18-222-175-68.us-east-2.compute.amazonaws.com',
        FB_APP_ID: 'qwedfght2345'
    }
})
