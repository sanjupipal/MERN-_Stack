import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/layout';
import withAdmin from '../../withAdmin';
import Link from 'next/link';

const Read = ({user , token}) =>{

        const [state, setState] = useState({
            error: '',
            success: '',
            categories: []
        });

        const {error , success, categories} = state

        useEffect(()=>{
            loadCategories()
        },[])

        const loadCategories = async () =>{
            const  response = await axios.get(`${API}/categories`)
            setState({...state, categories: response.data})
        }

        const confirmDelete =(slug) =>{
            console.log('delete >', slug);
        }

        const listCategories = () => categories.map((c,i)=>(
            <Link key={i} href={`/links/${c.slug}`}>
                <a style={{border: '1px solid red'}} className="bg-light p-3 col-md-6">
                    <div>
                        <div className="row">
                            <div className="col-md-3">
                                <img src={c.image && c.image.url} alt={c.name} style={{width: '100px', height:'auto'}} className="pr-3"></img>
                            </div>
                            <div className="col-md-6">
                                <h3>{c.name}</h3>
                            </div>
                            <div className="col-md-3">
                                 <Link href={`/admin/category/${c.slug}`}>
                                     <button className="btn btn-sm btn-outline-success btn-block mb-1">Update</button>
                                 </Link>
                                 <button onClick={() => confirmDelete(c.slug)} className="btn btn-sm btn-outline-danger btn-block">
                                    Delete
                                 </button>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ))
        return(
            <Layout>
                <div className="row">
                    <div className="col">
                        <h1>List of Categories</h1>
                        <br/>

                    </div>
                </div>
                <div className="row">{listCategories()}

                </div>
            </Layout>
        )

}

export default withAdmin(Read)