import cookie from 'js-cookie'
import Router from 'next/router'

export const setCookie = (key , value) => {
    if(process.browser){
        cookie.set(key,value ,{
            expires: 1
        })
    }
}


export const removeCookie = (key , value) => {
    if(process.browser){
        cookie.remove(key)
    }
}


export const getCookie = key =>{
    if(process.browser){
        return cookie.get(key)
    }
}

export const setLocalStorage = (key,value) =>{
    if(process.browser){
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = (key) =>{
    if(process.browser){
        localStorage.removeItem(key)
    }
}

export const authenticate = (response, next) =>{
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next()
}

export const isAuth =() =>{
    if(process.browser){
        const cookieChecked = getCookie('token')
        if(cookieChecked) {
            if(localStorage.getItem('user')){
                return JSON.parse(localStorage.getItem('user'))
            }
            else{
                return false
            }
        }
    }
}

export const logout =() =>{
    removeCookie('token')
    removeLocalStorage('user')
    Router.push('/login')
}