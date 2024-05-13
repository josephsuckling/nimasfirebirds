import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/FirestoreAPI';
import '../css/CategoriesManager.css';

function CategoriesManager() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editStatus, setEditStatus] = useState({});
    const [editedName, setEditedName] = useState({});

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
    };

    const handleAddCategory = async () => {
        if (newCategory) {
            await addCategory(newCategory);
            setNewCategory('');
            fetchCategories();  // Refresh the list
        }
    };

    const handleEditCategory = (id) => {
        setEditStatus({ ...editStatus, [id]: true });
        setEditedName({ ...editedName, [id]: categories.find(cat => cat.id === id).name });
    };

    const handleUpdateCategory = async (id) => {
        if (editedName[id]) {
            await updateCategory(id, editedName[id]);
            setEditStatus({ ...editStatus, [id]: false });
            fetchCategories();  // Refresh the list
        }
    };

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id);
        fetchCategories();  // Refresh the list
    };

    return (
        <div className="category-manager">
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
            />
            <button onClick={handleAddCategory}>Add Category</button>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {editStatus[category.id] ? (
                            <>
                                <input
                                    type="text"
                                    value={editedName[category.id]}
                                    onChange={(e) => setEditedName({ ...editedName, [category.id]: e.target.value })}
                                />
                                <button onClick={() => handleUpdateCategory(category.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                {category.name}
                                <button onClick={() => handleEditCategory(category.id)}>Edit</button>
                                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoriesManager;
