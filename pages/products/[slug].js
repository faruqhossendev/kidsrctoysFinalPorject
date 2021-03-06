import React, {useState, useEffect} from 'react'
import fetch from 'node-fetch'
import Link from 'next/link';

const Product = ({ allcatagory, catagorypost }) => {
    const [sortdata, setSortdata] = useState('')
    const [allproduct, setAllproduct] = useState(catagorypost)
    const sortHandler = (e)=>{
        e.preventDefault()
        setSortdata(e.target.value)
    }
    // console.log('sort value', sortdata)
    
        useEffect(()=>{
            if(sortdata === 'low'){
            const lowData = allproduct.sort((a,b)=>{
                return parseInt(a.acf.price) - parseInt(b.acf.price)
            })
            setAllproduct(lowData)
        }
           
        }, [sortdata])
    

    console.log('sorted data', allproduct)

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-3 border-right d-sm-none d-md-block">
                    <ul className="list-group list-group-flush hover-color">
                        {
                            allcatagory.map((catagory) => {
                                return (
                                    <li key={catagory.id} className='list-group-item list-group-item-action'>
                                        <Link href='/products/[slug]' as={`/products/${catagory.slug}`} ><a className='text-decoration-none font-weight-bold text-secondary'>{catagory.name}</a></Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="col-md-9">
                    <div className='row'>
                        <div className='col'>
                            <form className="form-inline float-right">
                                <div className="form-group">
                                    <label className='mr-2' htmlFor="inlineFormCustomSelect">Sort By</label>
                                    <select onChange={sortHandler} className="custom-select" id="inlineFormCustomSelect">
                                        <option value='' >Select</option>
                                        <option value="low">Low To High</option>
                                        <option value="high">High To Low</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        {
                            allproduct.map((post) => {
                                return (
                                    <div className="col-md-4 p-2" key={post.id}>
                                        <div className="card">
                                            <Link href='/[slug]' as={`/${post.slug}`}><a className='text-decoration-none card-header text-body'><h6 >{post.title.rendered}</h6></a></Link>
                                            <div className="card-body p-0">
                                                <img src={post.better_featured_image.source_url} className="card-img-top" alt={post.better_featured_image.alt_text} />
                                                <p className="card-text my-1 p-2 text-justify pro_desc">{post.acf.description}</p>
                                                <div className='card-footer p-2'>
                                                    <p className='font-weight-bold text-secondary'>Price : ${post.acf.price} </p>
                                                    <div className=''>
                                                        <a className='border_none font-weight-bold btn-sm btn btn-warning text-uppercase text-white' href={post.acf.aliexpress_link} target='blank'>Amazone</a>
                                                        <a className='border_none font-weight-bold btn-sm btn btn-warning text-uppercase text-white ml-3' href={post.acf.amazon_link} target='blank'>Ali Express</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

            </div>
        </div>
    );
};
// For Get catagory
export async function getCatagory() {
    const res = await fetch('http://hometoos.com/kidsrctoys/wp-json/wp/v2/categories')
    const data = await res.json()
    return data
}

export async function getStaticProps(context) {

    // const myslug = context.params.slug
    const allcatagory = await getCatagory()
    const findid = await allcatagory.find(({ slug }) => slug === context.params.slug)
    const myid = await findid.id
    const res = await fetch(`http://hometoos.com/kidsrctoys/wp-json/wp/v2/posts?categories=${myid}`)
    const catagorypost = await res.json()

    return {
        props: { allcatagory, catagorypost }
    }
}

export async function getStaticPaths() {
    const posts = await getCatagory()
    const paths = posts.map(post => ({ params: { slug: post.slug } }))
    return {
        paths,
        fallback: false
    }
}

export default Product;