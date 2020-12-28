import Layout from '../components/layout'
import Link from 'next/link'
import Router from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {showSuccessMessage, showErrorMessage} from '../helpers/alerts'
import {API} from '../config'
import {authenticate, isAuth} from '../helpers/auth'


const  Login = () => {
    
    const[state, setState] = useState({
        email:'25san1997@gmail.com',
        password:'252sanju',
        error: '',
        success:'', 
        buttonText:'Login'
        
    })
    useEffect(()=>{
        isAuth() && Router.push('/')
    }, [])
    const {email, password, error, success, buttonText} = state;
    const handelChange = (name) =>(e) =>{
        setState({...state, [name]: e.target.value, error: '', success:'', buttonText:'Login'})
    }

    const handelSubmit = async (e) =>{
         e.preventDefault();
        setState({...state, buttonText:'Logging in'})

        try{
            const response  = await axios.post(`${API}/login`, {
                 email: email, password: password
            })
            console.log(response);
            authenticate(response, ()=> isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user'))
        }catch(error){
            console.log(error);
            setState({...state, buttonText:'Login', error: error.response.data.error})
        }
    }

    const loginForm = () =>(
        <form onSubmit={handelSubmit}>
             <div className="form-group" >
                <input value={email} onChange={handelChange('email')} type="email" className="form-control" required placeholder="Type your email"></input>
            </div>
            <div className="form-group" >
                <input value={password} onChange={handelChange('password')} type="password" className="form-control" required placeholder="Type your password"></input>
            </div>
            <div className="form-group" >
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    )

    return (
    <Layout>

            <div className="col-md-6 offset-md-3">
            <h1>
                Login
            </h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {loginForm()}
         </div>
    </Layout>
    )
}

export default Login;