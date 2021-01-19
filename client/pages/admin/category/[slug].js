import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/layout';
import withAdmin from '../../withAdmin';
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.bubble.css'
const ReactQuill = dynamic(()=>import('react-quill'),{ssr: false}) 

const Update = ({oldCategory, token }) => {
    const [state, setState] = useState({
        name: oldCategory.name,
        error: '',
        success: '',
        buttonText:'Update',
        imagePreview: oldCategory.image.url,
        image: ''
    });

    const [content, setContent] = useState(oldCategory.content)

    const [imageUploadButtonName, setImageUploadButtonName] = useState('Update image');

    const { name, success, error, image, buttonText, imagePreview} = state;

    const handelContent = e =>{
         setContent(e)
         setState({...state, success:'', error:''})
    }

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '', buttonText:'Update' });
    };

    const handleImage = event => {
        let fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        setImageUploadButtonName(event.target.files[0].name);
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    // console.log(uri);
                    setState({ ...state, image: uri, success: '', error: '' });
                },
                'base64'
            );
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Updating' });
        console.table({ name, content, image });
        try {
            const response = await axios.put(
                `${API}/category/${oldCategory.slug}`,
                { name, content, image },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // console.log('CATEGORY UPDATE RESPONSE', response);
            setImageUploadButtonName('Update image');
            setState({
                ...state,
                buttonText: 'Updated',
                imageUploadText: 'Update image',
                success: `${response.data.name} is Updated`,
                imagePreview:response.data.image.url
            });
        } catch (error) {
            console.log('CATEGORY UPDATE ERROR', error);
            setState({ ...state, buttonText: 'Update', error: error.response });
        }
    };

    const updateCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <ReactQuill
                    value={content}
                    onChange={handelContent}
                    placeholder="Write something..."
                    theme="bubble"
                    className="pb-5 mb-3" 
                    style={{border : '1px solid #666 '}}
                />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadButtonName}
                    {' '}
                    <span>
                        <img src={imagePreview} alt="image" height="30"></img>
                    </span>
                    <input onChange={handleImage} type="file" accept="image/*" className="form-control" hidden />
                </label>
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Update Category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {updateCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

Update.getInitialProps =  async ({req, query, token}) =>{
    const response = await axios.post(`${API}/category/${query.slug}`)
    return {oldCategory: response.data.category, token}
}
export default withAdmin(Update);