import Layout from '../../components/layout';
import axios from 'axios'
import { API } from '../../config'
import { getCookie } from '../../helpers/auth'
import withUser from '../withUser'
import Link from 'next/link'
import moment from 'moment'
import { Router } from 'next/router';

const  User = ({ user, token, userLinks }) => {

    const confirmDelete = (e,id ) =>{
        e.preventDefault();
            let answer = window.confirm('Are you sure you want to delete?')
            if(answer){
                handleDelete(id);
            }
    }

    const handleDelete = async (id) =>{
        try{
           const response = await axios.delete(`${API}/link/${id}`,{
               headers:{
                   Authorization:`Bearer ${token}`
               }
           })
           console.log('Link delete success', response);
           Router.replace('/user')
        }catch(error){
           console.error(error);
        }
   }

    const listOfLinks = () => userLinks.map((l,i)=>(
        <div key={i} className="row alert alert-primary pd-2">
            <div className="col-md-8">
                <a href={l.url} target="_blank">
                    <h5 className="pt-2">{l.title}</h5>
                    <h6 className="pt-2 text-danger" style={{fontSize: '12px'}}>{l.url}</h6>
                </a>
            </div>
            <div className="col-md-4 pt-2">
                <span className="pull-right">
                    {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                </span>
            </div>
            <div className="col-md-12">
                <span className="badge text-dark">{l.type} / {l.medium}</span>
                {l.categories.map((c,i)=>(
                    <span key={i} className="badge text-success">{c.name}</span>
                ))}
                <span className="badge text-secondary">{l.clicks} clicks</span>
                <Link href={`/user/link/${l._id}`}>
                    <span className="badge text-warning pull-right">
                        Update
                    </span>
                </Link>
                <span onClick={(e)=>{confirmDelete(e, l._id)}} className="badge text-danger pull-right">
                    Delete
                </span>
            </div>
        </div>
    ))

    return (
        <Layout>
            <h1>{user.name}'s dashboard <span className="text-danger">/{user.role}</span></h1>
            <hr/>
            <div className="row">
                <div className="col-md-4">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/user/link/create">
                                <a className="nav link">Submit a link</a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/user/profile/update">
                                <a className="nav link">Update Profile</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="col-md-8">
                    <h2>Your Links</h2>
                    <br/>
                    {listOfLinks()}
                </div>
            </div>
        </Layout>
    )
}

export default withUser(User);