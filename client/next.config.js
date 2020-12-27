const withCSS = require('@zeit/next-css')

module.exports = withCSS({
    publicRuntimeConfig:{
        APP_NAME: 'NODE-REACT-AWS',
        API: 'http://localhost:8080/api',
        PRODUCTION: false,
        DOMAIN: 'http://localhost:3000',
        FB_APP_TD: 'qwedfght2345'
    }
})