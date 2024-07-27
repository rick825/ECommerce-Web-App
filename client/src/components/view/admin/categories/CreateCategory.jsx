import React, { useState } from 'react';
import { useAdminContext } from '../../../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateCategory = ({ showForm, setShowForm, setRefresh }) => {
    const { adminData } = useAdminContext();
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // handle form visibility
    const handleForm = (value) => {
        setShowForm(value);
    };

    // handle unique ID generation
    const handleUniqueId = () => {
        const uniqueId = Math.floor(Math.random() * 100).toString().padStart(3, '0');
        return uniqueId;
    };

    // submit new category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (adminData.admin.role === 'all' || adminData.admin.role === 'write') {
                const unId = handleUniqueId();
                console.log("Category Form Data:", unId, formData);

                let token;
                try {
                    token = adminData.token ? adminData.token : {};
                } catch (error) {
                    console.error("Invalid token format:", error);
                    toast.error("Invalid token format");
                    return;
                }

                const response = await axios.post('/api/createCategory', { unId, formData }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.status === 200) {
                    toast.success('Category Created Successfully');
                    setShowForm(false);
                    setRefresh("Created");
                }
            } else {
                toast.warning("You are not authorized to create category");
            }
        } catch (error) {
            console.log("Error while Creating Category -->", error);
            toast.error("Error while Creating Category");
        }
    };

    return (
        <div className="formClass">
            <form className="form" onSubmit={handleSubmit}>
                <div className="formHead">
                    <h2>Enter Data For Category:</h2>
                    <h3 onClick={() => handleForm(false)}>X</h3>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Category Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name='name'
                        placeholder="Enter Category Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateCategory;
