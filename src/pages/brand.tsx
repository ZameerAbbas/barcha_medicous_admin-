/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";

import {
    startBrandRealtime,
    addBrandOrder,
    updateBrandOrder,
    deleteBrandOrder,
    type BrandOrder,
} from "../features/brandSlice";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Loader from "../components/Loader";



const AddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

interface BrandFormProps {
    brandToEdit: BrandOrder | null;
    onClose: () => void;
}

const BrandForm: React.FC<BrandFormProps> = ({ brandToEdit, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<BrandOrder>({
        brand: brandToEdit?.brand || "",

    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: BrandOrder = {
            brand: formData.brand,

        };

        if (brandToEdit?.id) {
            dispatch(updateBrandOrder({ id: brandToEdit.id, ...payload }));
        } else {
            dispatch(addBrandOrder(payload));
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {brandToEdit ? "Edit Brand" : "Add New Brand"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="brand" className="block text-sm font-medium text-gray-700">Name</Label>
                        <Input
                            type="text"
                            name="brand"
                            id="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                            {brandToEdit ? "Save Changes" : "Create Brand"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Brands() {
    const dispatch = useDispatch<AppDispatch>();
    const { brandOrders, loading } = useSelector((state: RootState) => state.brand);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandOrder | null>(null);

    useEffect(() => {
        dispatch(startBrandRealtime());
    }, [dispatch]);

    const handleEdit = (brand: BrandOrder) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingBrand(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: any, name: any) => {
        if (!id) return;
        if (window.confirm(`Are you sure you want to delete the brand: "${name}"?`)) {
            dispatch(deleteBrandOrder(id));
        }
    };



    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Brands</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <AddIcon />
                    Add Brand
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>

                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {brandOrders.length > 0 ? (
                            brandOrders.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="flex items-center space-x-3">

                                            <span>{brand.brand}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Edit Brand"
                                        >
                                            <EditIcon />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(brand.id, brand.brand)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Delete Brand"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No brands found. Click 'Add Brand' to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <BrandForm
                    brandToEdit={editingBrand}
                    onClose={() => { setIsModalOpen(false); setEditingBrand(null); }}
                />
            )}
        </div>
    );
}
