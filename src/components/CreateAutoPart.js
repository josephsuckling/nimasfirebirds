import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateAutoPart.css';
import { saveAutoPart, getCategories } from '../api/FirestoreAPI';

function CreateAutoPart() {
    const [partData, setPartData] = useState({
        name: '',
        dimensions: '',
        weight: '',
        color: '',
        material: '',
        models: '',
        manufacturer: '',
        warranty: '',
        category: '',
        cost: '',
        description: '',
        inStock: true
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryData = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        };
        fetchCategoryData();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPartData({ ...partData, [name]: value });
    };

    const handleFileChange = (event) => {
        setImages([...event.target.files]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!partData.name || !partData.category || !partData.cost || !partData.description) {
            alert("Please fill in all required fields.");
            return;
        }
        console.log(partData, images);
        try {
            const docId = await saveAutoPart(partData, images);
            console.log("Auto part created with ID:", docId);
            alert("Auto part created successfully!");
            navigate('/autoparts-hub'); // Navigate to AutoPartsHub after successful submission
        } catch (error) {
            console.error("Error creating auto part:", error);
            alert("Failed to create auto part.");
        }
    };

    return (
        <div className="create-auto-part">
            <form onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" name="name" value={partData.name} required onChange={handleInputChange} />
                </label>
                <label>Cost:
                    <div className="input-with-prefix">
                        <span>$</span>
                        <input type="number" name="cost" value={partData.cost} required onChange={handleInputChange} />
                    </div>
                </label>
                <label>Description:
                    <textarea name="description" value={partData.description} required onChange={handleInputChange} />
                </label>
                <label>Dimensions:
                    <input type="text" name="dimensions" value={partData.dimensions} onChange={handleInputChange} />
                </label>
                <label>Weight:
                    <input type="text" name="weight" value={partData.weight} onChange={handleInputChange} />
                </label>
                <label>Color:
                    <input type="text" name="color" value={partData.color} onChange={handleInputChange} />
                </label>
                <label>Material:
                    <input type="text" name="material" value={partData.material} onChange={handleInputChange} />
                </label>
                <label>Compatible Vehicle Models:
                    <input type="text" name="models" value={partData.models} onChange={handleInputChange} />
                </label>
                <label>Manufacturer Info:
                    <input type="text" name="manufacturer" value={partData.manufacturer} onChange={handleInputChange} />
                </label>
                <label>Warranty Details:
                    <input type="text" name="warranty" value={partData.warranty} onChange={handleInputChange} />
                </label>
                <label>Category:
                    <select name="category" value={partData.category} required onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </label>
                <label>In Stock:
                    <input type="checkbox" name="inStock" checked={partData.inStock} onChange={(e) => setPartData({ ...partData, inStock: e.target.checked })} />
                </label>
                <label>Upload Images (up to 3):
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                </label>
                <button type="submit">Create Auto Part</button>
            </form>
        </div>
    );
}

export default CreateAutoPart;
