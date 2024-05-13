import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/ShippingPartners.css';  // Ensure you have a corresponding CSS file
import { fetchShippingPartners } from '../api/FirestoreAPI'; // Mock API to fetch partners

function ShippingPartners() {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const loadPartners = async () => {
            const fetchedPartners = await fetchShippingPartners();
            setPartners(fetchedPartners);
        };
        loadPartners();
    }, []);

    return (
        <div className="shipping-partners">
            <div className="partners-container">
                {partners.map(partner => (
                    <div key={partner.id} className="partner-item">
                        <h3>{partner.name}</h3>
                        <p><strong>Address:</strong> {partner.address}</p>
                        <p><strong>Contact:</strong> {partner.contactName}</p>
                        <p><strong>Email:</strong> {partner.email}</p>
                        <p><strong>Phone:</strong> {partner.phone}</p>
                        <p><strong>Shipping Types:</strong> {partner.shippingTypes}</p>
                        <p><strong>Service Areas:</strong> {partner.serviceAreas}</p>
                    </div>
                ))}
            </div>
            <Link to="/add-shipping-partner" className="add-partner-button">
                Add Shipping Partner
            </Link>
        </div>
    );
}

export default ShippingPartners;
