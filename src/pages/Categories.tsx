/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";

import {
    startCategoriesRealtime,
    addCategory,
    updateCategory,
    deleteCategory,
    type Category,
} from "../features/products/categoriesSlice";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface CategoryFormData {
    image: string | undefined;
    id?: string;
    name: string;
    description: string;
}


const AddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;



interface CategoryFormProps {
    categoryToEdit: Category | null;
    onClose: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToEdit, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<CategoryFormData>({
        name: categoryToEdit?.name || "",
        description: categoryToEdit?.description || "",
        image: categoryToEdit?.image || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                image: reader.result as string,
            }));
        };
        reader.readAsDataURL(file);
    };

    console.log("Form Data Image:", formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const categoryPayload: Category = {
            name: formData.name,
            description: formData.description,
            image: formData.image,
        };

        if (categoryToEdit?.id) {
            // UPDATE operation
            dispatch(updateCategory({ id: categoryToEdit.id, ...categoryPayload }));
        } else {
            // ADD operation
            dispatch(addCategory(categoryPayload));
        }

        onClose();
    };

    return (
        // Modal Backdrop
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {categoryToEdit ? "Edit Category" : "Add New Category"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>


                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="productImage">Product Image</Label>
                        <Input
                            id="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
                        >
                            {categoryToEdit ? "Save Changes" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};




export default function Categories() {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, loading } = useSelector((state: RootState) => state.categories);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    console.log("categories:", categories);


    useEffect(() => {
        dispatch(startCategoriesRealtime());
    }, [dispatch]);


    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: any, name: any) => {
        if (!id) return;

        if (window.confirm(`Are you sure you want to delete the category: "${name}"?`)) {
            dispatch(deleteCategory(id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };


    // --- Render Logic ---
    if (loading) {
        return (
            <div className="p-8 text-center text-xl text-gray-500">Loading categories...</div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <AddIcon />
                    Add Category
                </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center space-x-3">
                                            {category.image && (
                                                <img src={category.image} alt={category.name} className="h-8 w-8 object-cover rounded-md" />
                                            )}
                                            <span>{category.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-sm">{category.description || 'No description provided.'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Edit Category"
                                        >
                                            <EditIcon />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Delete Category"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No categories found. Click 'Add Category' to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {isModalOpen && (
                <CategoryForm
                    categoryToEdit={editingCategory}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}