import Layout from '../../../components/layout'
import withAdmin from '../../withAdmin'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {API} from '../../../config'
import {showSuccessMessage, showErrorMessage} from '../../../helpers/alerts'

const Create = ({user,token}) =>{

    const [state, setState] = useState({
        name: '',
        content: '',
        error: '',
        success: '',
        formData: process.browser && new FormData(),
        buttonText: 'Create',
        imageUploadText: 'Upload image'
    })

    const {name, content, success, error, formData,  buttonText, imageUploadText} =  state

    const handelChange = (name) =>(e) =>{
        const value = name === 'image' ? e.target.files[0] : e.target.value
        const imageName = name === 'image' ? event.target.files[0].name : 'Upload image'
        formData.set(name, value)
        setState({...state, [name]: value, error: '', success:'', imageUploadText: imageName})
    }

    const handelSubmit = async e =>{
        e.preventDefault()
        setState({...state, buttonText:'Creating'})
        // console.log(...formData);
        try{
            const response = await axios.post(`${API}/category`, formData, {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setState({...state, name:'', success:`${response.data.name} is created`, content:'', formData:'', buttonText:'Created', imageUploadText:"Upload Image"})
        }catch(error){
            console.log("category create",error)
            setState({...state, name:'',  buttonText:'Create', error:error.response.data.error})    
        }
    }


    const createCategoryForm = () =>(
        <form onSubmit={handelSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handelChange('name')} required value={name}></input>
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <textarea  className="form-control" onChange={handelChange('content')} required value={content}></textarea>
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary ">
                    {imageUploadText}
                    <input type="file" className="form-control" accept="image/*" onChange={handelChange('image')} hidden ></input>
                </label>
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Create category</h1>
                    <br/>
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    )
}

export default withAdmin(Create)