/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store"; // Adjust path to your store setup
import {
    startAddressesRealtime,
    addAddress,
    updateAddress,
    deleteAddress,
    type Address,
} from "../features/adress/addressSlice";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import Loader from "../components/Loader";

// Define the shape for the form data
interface AddressFormData {
    id?: string;
    street: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    deliveryFee: string;
    deliveryFree: string;
}

const AddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

interface AddressFormProps {
    addressToEdit: Address | null;
    onClose: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ addressToEdit, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<AddressFormData>({
        street: addressToEdit?.street || "",
        city: addressToEdit?.city || "",
        stateProvince: addressToEdit?.stateProvince || "",
        zipCode: addressToEdit?.zipCode || "",
        deliveryFee: addressToEdit?.deliveryFee || "",
        deliveryFree: addressToEdit?.deliveryFree || "",
    });

    console.log("formData", formData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const addressPayload: Omit<Address, 'id'> = formData; // Use Omit to ensure no ID is passed if adding

        if (addressToEdit?.id) {
            // UPDATE operation
            dispatch(updateAddress({ id: addressToEdit.id, ...addressPayload }));
        } else {
            // ADD operation
            dispatch(addAddress(addressPayload as Address)); // Cast needed since ID is optional on Address interface
        }

        onClose();
    };






    return (
        // Modal Backdrop
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {addressToEdit ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <Label htmlFor={"street"} className="mb-1">
                            Street
                        </Label>
                        <Input name="street" value={formData.street} onChange={handleChange} />

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor={"city"} className="mb-1">
                            City
                        </Label>
                        <Input name="city" value={formData.city} onChange={handleChange} />

                        <Label htmlFor={"stateProvince"} className="mb-1">
                            State Province
                        </Label>
                        <Input name="stateProvince" value={formData.stateProvince} onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor={"deliveryFee"} className="mb-1"> Delivery Fee  </Label>
                        <Input name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Label htmlFor={"deliveryFree"} className="mb-1"> Free Delivery on Orders Over </Label>
                        <Input name="deliveryFree" value={formData.deliveryFree} onChange={handleChange} />
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
                            {addressToEdit ? "Save Changes" : "Create Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default function Address() {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, loading } = useSelector((state: RootState) => state.addresses);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // 1. Start Realtime Listener
    useEffect(() => {
        dispatch(startAddressesRealtime());
    }, [dispatch]);

    // --- CRUD Handlers ---
    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string | undefined, addressDisplay: string) => {
        if (!id) return;

        if (window.confirm(`Are you sure you want to delete this address: "${addressDisplay}"?`)) {
            dispatch(deleteAddress(id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    // Helper to format address for display/confirmation
    const formatAddress = (address: Address) => (
        `${address.street}, ${address.city}, ${address.zipCode}`
    );

    // --- Render Logic ---
    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="p-4 sm:p-8">
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Addresses</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <AddIcon />
                    Add Address
                </button>
            </div>

            {/* Addresses Table (READ Operation) */}
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Street</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City, State</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Fee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  Free Delivery on Orders Over</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <tr key={address.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{address.street}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${address.city}, ${address.stateProvince}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${address.deliveryFee}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${address.deliveryFree || "N/A"}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => handleEdit(address)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Edit Address"
                                        >
                                            <EditIcon />
                                        </button>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(address.id, formatAddress(address))}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Delete Address"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No addresses found. Click 'Add Address' to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Render */}
            {isModalOpen && (
                <AddressForm
                    addressToEdit={editingAddress}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}