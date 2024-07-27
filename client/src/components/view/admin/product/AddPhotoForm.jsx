import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminContext } from '../../../../context/AdminContext';
import { toast } from 'react-toastify';

const AddPhotoForm = ({ onUploadComplete,setFormShow }) => {
    const [images, setImages] = useState([]);
    const {seeProduct,adminData} = useAdminContext();
 

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            if (file.size > 200 * 1024) { 
                toast.error(`${file.name} exceeds the 200 KB size limit.`);
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImages(prevImages => [...prevImages, reader.result]);
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(adminData.admin.role === 'all' || adminData.admin.role === 'write'){
                const token = adminData.token;
                const response = await axios.post('/api/product/uploadPhotos', {
                    seeProduct,
                    images
                },{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    toast.success('Photos uploaded successfully');
                    onUploadComplete();
                    setFormShow(false);
                }
            }else{
                toast.error('You are not authorized to perform this action');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            toast.error("Error while uploading photo");
        }
    };

    return (
        <div className="formClass addphotoform">
        <form className="form" onSubmit={handleSubmit}>
            <p onClick={()=>setFormShow(false)}>close</p>
            <input type="file" multiple onChange={handleImageChange} />
            <button type="submit">Upload Photos</button>
        </form>
        </div>
    );
};

export default AddPhotoForm;
