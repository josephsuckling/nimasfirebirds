import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAutoParts } from '../api/FirestoreAPI';  // Adjust the path as necessary
import '../css/AutoPartsHub.css';

function AutoPartsHub() {
    const [autoParts, setAutoParts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAutoParts().then(parts => {
            setAutoParts(parts);
        }).catch(error => {
            console.error("Error loading auto parts:", error);
        });
    }, []);

    const handleCreateNewPart = () => {
        navigate('/create-autopart');  // Navigate to the part creation page
    };

    return (
        <div className="auto-parts-hub">
            <div className="auto-parts-container">
                {autoParts.map(part => (
                    <div key={part.id} className="auto-part-item">
                        <h3>Category: {part.category}</h3>
                        <p><strong>Dimensions:</strong> {part.dimensions}</p>
                        <p><strong>Weight:</strong> {part.weight}</p>
                        <p><strong>Color:</strong> {part.color}</p>
                        <p><strong>Material:</strong> {part.material}</p>
                        <p><strong>Compatible Vehicle Models:</strong> {part.models}</p>
                        <p><strong>Manufacturer:</strong> {part.manufacturer}</p>
                        <p><strong>Warranty:</strong> {part.warranty}</p>
                        <div className="auto-part-images">
                            {part.imageUrls.map((url, index) => (
                                <img key={index} src={url} alt="Auto Part" style={{ width: "100px", margin: "10px" }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button className="create-part-button" onClick={handleCreateNewPart}>+</button>
        </div>
    );
}

export default AutoPartsHub;
