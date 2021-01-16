import Layout from '../../components/layout';
import axios from 'axios'
import { API } from '../../config'
import Link from 'next/link'
import {useState} from 'react'
import renderHTML from 'react-render-html'
import moment from 'moment'
import InfiniteScroll from 'react-infinite-scroller'

const Links = ({query,category,links,totalLinks,linksLimit,linkSkip}) =>{

    const [allLinks, setAllLinks] = useState(links)
    const [limit, setLimit] = useState(linksLimit)
    const [skip , setSkip] = useState(0)
    const [size, setSize] = useState(totalLinks)

    const handleClick = async (linkId ) =>{
        const response = await axios.put(`${API}/click-count`, {linkId})
        loadUpdatedLinks()
    }

    const loadUpdatedLinks = async() =>{
        const response = await axios.post(`${API}/category/${query.slug}`)
        setAllLinks(response.data.links)
    }

    const listOfLinks = () =>
        allLinks.map((l,i)=>(
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" onClick={e => handleClick(l._id)}>
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
                </div>
            </div>
        ))

        const loadMore = async ()=>{
            let toSkip = skip + limit
            const response = await axios.post(`${API}/category/${query.slug}`, {skip: toSkip, limit})
            setAllLinks([...allLinks, ...response.data.links])
            setSize(response.data.links.length)
            setSkip(toSkip)
        }
        // const loadMoreButton = () =>{
        //     return(
        //         size > 0 && size >= limit && (
        //             <button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More</button>
        //         )
        //     )
        // }

    return (<Layout>
        <div className="row">
            <div className="col-md-8">
                <h1 className="display-4 font-weight-bold">{category.name} - URL/Links</h1>
                <div className="lead alert alert-secondary pt-4">{renderHTML(category.content)}</div>
            </div>
            <div className="col-md-4">
                <img src={category.image.url} alt={category.name} style={{width:'auto', maxHeight:'200px'}}></img>
            </div>
        </div>
        <br/>
        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={<div className="lader" key={0}>
                <img  key={0} src="/static/css/Display-Loading.gif" alt="Loading..."></img>
            </div>}
        >

        <div className="row">
            <div className="col-md-8">
                {listOfLinks()}
            </div>
            <div className="col-md-4">
                <h2 className="lead">Most popular in {category.name}</h2>
                <p>show popular links</p>
            </div>
        </div>
        </InfiniteScroll>
    </Layout>)
}

Links.getInitialProps = async ({query, req}) =>{
    let skip = 0
    let limit = 2

    const response = await axios.post(`${API}/category/${query.slug}`, {skip, limit})
    return {
        query,
        category : response.data.category,
        links :  response.data.links,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linkSkip: skip
    }
}

export default Links 