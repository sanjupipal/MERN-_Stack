import {useState, useEffect} from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {showSuccessMessage, showErrorMessage} from '../../../helpers/alerts'
import {API} from '../../../config'
import Layout from '../../../components/layout'
import {withRouter} from 'next/router'

const ActivateAccount = ({router}) =>{
    
    const [state, setstate] = useState({
        name:'',
        token:'',
        buttonText:'Activate Account',
        success:'',
        error: ''
    })
    const {name, token, buttonText, success, error} = state

    useEffect( ()=>{
        let token = router.query.id
        if(token){
            const {name} = jwt.decode(token)
            setstate({...state, name: name, token: token})
        }
    }, [router])

    const clickSubmit = async e =>{
        e.preventDefault()
        // console.log("ssss");
        setstate({...state, buttonText: 'Activating'})

        try{
            const response = await axios.post(`${API}/register/activate`, {token} )
            console.log(response);
            setstate({...state, name:'', token:'', buttonText:'Activated', success: response.data.message})
        }catch(error){
            setstate({...state, name:'', token:'', buttonText:'Activate Account', error: error.response.data.error})
        }
    }
    return <Layout>
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <h1>
                    G'day {name}, Ready to activate your account !?
                </h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                <button className="btn btn-outline-warning btn-block" onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </div>
    </Layout>
}

export default withRouter(ActivateAccount);