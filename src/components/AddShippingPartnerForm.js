import React, { useState } from 'react';
import { addShippingPartner } from '../api/FirestoreAPI';
import '../css/AddShippingPartnerForm.css'; // Make sure to create this CSS file

function AddShippingPartnerForm() {
    const [partnerData, setPartnerData] = useState({
        name: '',
        address: '',
        contactName: '',
        email: '',
        phone: '',
        shippingTypes: '',
        serviceAreas: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPartnerData({ ...partnerData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const docId = await addShippingPartner(partnerData);
            alert(`Shipping partner added successfully with ID: ${docId}`);
            setPartnerData({
                name: '',
                address: '',
                contactName: '',
                email: '',
                phone: '',
                shippingTypes: '',
                serviceAreas: ''
            }); // Reset form after submission
        } catch (error) {
            console.error('Failed to add shipping partner:', error);
            alert('Failed to add shipping partner.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-partner-form">
            <input type="text" name="name" value={partnerData.name} onChange={handleInputChange} placeholder="Name" required />
            <input type="text" name="address" value={partnerData.address} onChange={handleInputChange} placeholder="Address" required />
            <input type="text" name="contactName" value={partnerData.contactName} onChange={handleInputChange} placeholder="Contact Name" required />
            <input type="email" name="email" value={partnerData.email} onChange={handleInputChange} placeholder="Email" required />
            <input type="text" name="phone" value={partnerData.phone} onChange={handleInputChange} placeholder="Phone" required />
            <input type="text" name="shippingTypes" value={partnerData.shippingTypes} onChange={handleInputChange} placeholder="Shipping Types" required />
            <input type="text" name="serviceAreas" value={partnerData.serviceAreas} onChange={handleInputChange} placeholder="Service Areas" required />
            <button type="submit">Add Shipping Partner</button>
        </form>
    );
}

export default AddShippingPartnerForm;
