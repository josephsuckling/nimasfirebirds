import React, { useState, useEffect } from 'react';
import '../css/CreateAutoPart.css';  // Assuming you have a corresponding CSS file
import { saveAutoPart, getCategories } from '../api/FirestoreAPI';  // Import getCategories

function CreateAutoPart() {
    const [partData, setPartData] = useState({
        dimensions: '',
        weight: '',
        color: '',
        material: '',
        models: '',
        manufacturer: '',
        warranty: '',
        category: ''
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);  // State to store categories

    useEffect(() => {
        // Fetch categories when the component mounts
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
        console.log(partData, images);
        try {
            const docId = await saveAutoPart(partData, images);
            console.log("Auto part created with ID:", docId);
            alert("Auto part created successfully!");
        } catch (error) {
            console.error("Error creating auto part:", error);
            alert("Failed to create auto part.");
        }
    };

    return (
        <div className="create-auto-part">
            <form onSubmit={handleSubmit}>
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
                    <select name="category" value={partData.category} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
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
