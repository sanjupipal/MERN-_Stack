import Layout from '../../../components/layout';
import axios from 'axios'
import { API } from '../../../config'
import Link from 'next/link'
import {useState} from 'react'
import renderHTML from 'react-render-html'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroller'
import withAdmin from '../../withAdmin';
import {getCookie} from '../../../helpers/auth'

const Links = ({token ,links,totalLinks,linksLimit,linkSkip}) =>{

    const [allLinks, setAllLinks] = useState(links)
    const [limit, setLimit] = useState(linksLimit)
    const [skip , setSkip] = useState(0)
    const [size, setSize] = useState(totalLinks)

    const confirmDelete =(e,id) =>{
        // console.log('delete >', id);
        e.preventDefault();
        let answer = window.confirm('Are you sure you want to delete?')
        if(answer){
            handleDelete(id);
        }
    }

    const handleDelete = async (id) =>{
         try{
            const response = await axios.delete(`${API}/link/admin/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log('LINK delete success', response);
            process.browser && window.location.reload();
         }catch(error){
            console.error(error);
         }
    }

    const listOfLinks = () =>
        allLinks.map((l,i)=>(
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" >
                    <a href={l.url} target="_blank">
                        <h5 className="pt-2">{l.title}</h5>
                        <h6 className="pt-2 text-danger" style={{fontSize:'12px'}}>
                            {l.url}
                        </h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                    <br/>
                    <span className="badge text-secondary pull-right">{l.clicks} Clicks</span>
                </div>
                <div className="col-md-12">
                    <span className="badge text-dark">{l.type} / {l.medium}</span>
                    {l.categories.map((c,i) => (<span key={i} className="badge text-success">{c.name}</span>))}
                    <button onClick={(e)=>confirmDelete(e,l._id)} className="btn btn-sm btn-outline-success pull-right mb-1 mr-1">Delete</button>
                    <Link href={`/user/link/${l._id}`}>
                        <a><button className="btn btn-sm btn-outline-danger pull-right mb-1 mr-1">Update</button></a>
                    </Link>
                </div>
            </div>
        ))

        const loadMore = async ()=>{
            let toSkip = skip + limit
            const response = await axios.post(`${API}/links`, {skip: toSkip, limit}, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            setAllLinks([...allLinks, ...response.data])
            setSize(response.data.length)
            setSkip(toSkip)
        }

    return (<Layout>
        <div className="row">
            <div className="col-md-8">
                <h1 className="display-4 font-weight-bold">All Links</h1>
            </div>
        </div>
        <br/>
        
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={<div className="lader text-center" key={0}>
                <img  key={0} src="/static/css/Display-Loading.gif" alt="Loading..."></img>
            </div>}
        >

        <div className="row">
            <div className="col-md-12">
                {listOfLinks()}
            </div> 
        </div>
        </InfiniteScroll>
    </Layout>)
}

Links.getInitialProps = async ({req}) =>{
    let skip = 0
    let limit = 5
    const token = getCookie('token', req)
    const response = await axios.post(`${API}/links`, {skip, limit}, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    return {
        links :  response.data,
        totalLinks: response.data.length,
        linksLimit: limit,
        linkSkip: skip,
        token
    }
}

export default withAdmin(Links) 