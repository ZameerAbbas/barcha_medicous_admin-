/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";

import {
    startAgentsRealtime,
    addAgent,
    updateAgent,
    deleteAgent,
    type Agents,
} from "../features/agentsSlice";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Loader from "../components/Loader";

const AddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

// Helper function to generate random referral code
const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

interface AgentFormProps {
    agentToEdit: Agents | null;
    onClose: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ agentToEdit, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<Agents>({
        firstName: agentToEdit?.firstName || "",
        lastName: agentToEdit?.lastName || "",
        email: agentToEdit?.email || "",
        number: agentToEdit?.number || "",
        percentAge: agentToEdit?.percentAge || 0,


    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: Agents = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email,
            number: formData.number,
            referralCode: formData.referralCode || generateReferralCode(),
            percentAge: formData.percentAge,
        };

        const { referralCode, ...payloadWithout } = payload

        if (agentToEdit?.id) {
            // For update, include the ID
            dispatch(updateAgent({ id: agentToEdit.id, ...payloadWithout }));
        } else {
            // For new agent, generate referral code if needed
            // Note: You might want to add this to the Agents interface and Firebase node
            dispatch(addAgent(payload));
        }

        onClose();
        dispatch(startAgentsRealtime());
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {agentToEdit ? "Edit Agent" : "Add New Agent"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</Label>
                        <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div>
                        <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</Label>
                        <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter last name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</Label>
                        <Input
                            type="text"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Agent Email"
                        />
                    </div>
                    <div>
                        <Label htmlFor="number" className="block text-sm font-medium text-gray-700">Number</Label>
                        <Input
                            type="text"
                            name="number"
                            id="number"
                            required
                            value={formData.number}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter Agent Number"
                        />
                    </div>
                    <div>
                        <Label htmlFor="percentAge" className="block text-sm font-medium text-gray-700">
                            Commission Percentage
                        </Label>

                        <div className="mt-1 relative rounded-md shadow-sm">
                            <Input
                                type="number"
                                name="percentAge"
                                id="percentAge"
                                required
                                min="0.1"
                                max="100"
                                step="0.01"
                                value={formData.percentAge || ""} // Handles empty case
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value;
                                    const numValue = parseFloat(value);

                                    // Only update if empty or valid number
                                    if (value === '' || (!isNaN(numValue) && numValue >= 0.1 && numValue <= 100)) {
                                        setFormData({
                                            ...formData,
                                            percentAge: value === '' ? 0 : numValue
                                        });
                                    }
                                }}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">%</span>
                            </div>
                        </div>

                        {formData.percentAge !== undefined && formData.percentAge !== 0 && (
                            <div className="mt-2">
                                {formData.percentAge < 0.1 && (
                                    <p className="text-sm text-red-600">❌ Minimum is 0.1%</p>
                                )}
                                {formData.percentAge > 100 && (
                                    <p className="text-sm text-red-600">❌ Maximum is 100%</p>
                                )}
                                {formData.percentAge >= 0.1 && formData.percentAge <= 100 && (
                                    <p className="text-sm text-green-600">
                                        ✓ {formData?.percentAge}% commission
                                    </p>
                                )}
                            </div>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            Enter between 0.1% and 100%
                        </p>
                    </div>



                    {/* You can add email, number, and referral code fields here if you update the interface */}

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
                            {agentToEdit ? "Save Changes" : "Create Agent"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function AgentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { agents, loading } = useSelector((state: RootState) => state.agents);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agents | null>(null);

    useEffect(() => {
        // Start realtime Firebase listener
        dispatch(startAgentsRealtime());
        return () => {
            // If you need to explicitly unsubscribe, store the unsubscribe function
        };
    }, [dispatch]);

    const handleEdit = (agent: Agents) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: any, name: any) => {
        if (!id) return;
        const fullName = `${name?.firstName || ''} ${name?.lastName || ''}`.trim();
        if (window.confirm(`Are you sure you want to delete agent: "${fullName}"?`)) {
            dispatch(deleteAgent(id));
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
                <h1 className="text-3xl font-bold text-gray-800">Agents</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    <AddIcon />
                    Add Agent
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral Code</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {agents.length > 0 ? (
                            agents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {agent.firstName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {agent.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {agent.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {agent.number}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {agent.percentAge}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {agent.referralCode}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(agent)}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Edit Agent"
                                        >
                                            <EditIcon />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(agent.id, agent)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition"
                                            title="Delete Agent"
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-lg">
                                    No agents found. Click 'Add Agent' to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AgentForm
                    agentToEdit={editingAgent}
                    onClose={() => { setIsModalOpen(false); setEditingAgent(null); }}
                />
            )}
        </div>
    );
}















