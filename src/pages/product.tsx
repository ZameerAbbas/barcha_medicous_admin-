
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store"; // Adjust path to your store setup
import {
  startProductsRealtime,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "../features/products/productsSlice";
import {
  startCategoriesRealtime,
  type Category,
} from "../features/products/categoriesSlice";


import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";


interface ProductFormData {
  id?: string;
  name: string;
  price: string; // Use string for input, convert to number on submit
  categoryId: string;
  description: string;
  productImage: string;
  mg: string; // Use string for input, convert to number on submit
}

// --- Icons (Using placeholders for Tailwind-friendly display) ---
const AddIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>;


// =======================================================
//                   PRODUCT FORM MODAL COMPONENT
// =======================================================
interface ProductFormData {
  id?: string;
  name: string;
  price: string;
  categoryId: string;
  description: string;
  productImage: string;
  mg: string;
}

interface ProductFormProps {
  productToEdit: Product | null;
  categories: Category[];
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, categories, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<ProductFormData>({
    name: productToEdit?.name || "",
    price: productToEdit?.price.toString() || "",
    categoryId: productToEdit?.categoryId || "",
    description: productToEdit?.description || "",
    productImage: productToEdit?.productImage || "",
    mg: productToEdit?.mg.toString() || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Use functional update to ensure state consistency
    setFormData(prevData => ({
      ...prevData,
      [name as keyof ProductFormData]: value
    }));
  };

  // Custom handler for Shadcn Select component
  const handleSelectChange = (value: string) => {
    // Must use the previous pattern here because Select is not an input and doesn't fire a React.ChangeEvent
    setFormData(prevData => ({ ...prevData, categoryId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload: Product = {
      name: formData.name,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      description: formData.description,
      productImage: formData.productImage,
      mg: parseInt(formData.mg),
    };

    if (productToEdit?.id) {
      dispatch(updateProduct({ id: productToEdit.id, ...productPayload }));
    } else {
      dispatch(addProduct(productPayload));
    }

    onClose();
  };

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto transform transition-all">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-2xl font-extrabold text-gray-800">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* 1. Product Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* 2. Category Dropdown (SELECT Component) */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="categoryId">Category *</Label>
              <Select onValueChange={handleSelectChange} value={formData.categoryId} required>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent  >
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id!}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Price and MG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* 3. Price */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price  *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* 4. Dosage (mg) */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mg">Dosage (mg) *</Label>
              <Input
                id="mg"
                name="mg"
                type="number"
                value={formData.mg}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Description (Textarea) */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="resize-none min-h-[100px]"
            />
          </div>

          {/* Row 4: Image URL */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="productImage">Product Image URL</Label>
            <Input
              id="productImage"
              name="productImage"
              type="url"
              value={formData.productImage}
              onChange={handleChange}

            />
          </div>


          <div className="flex justify-end pt-5 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition mr-3 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              {productToEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 1. Start Realtime Listeners for both Products and Categories
  useEffect(() => {
    dispatch(startProductsRealtime());
    dispatch(startCategoriesRealtime());
  }, [dispatch]);


  // --- CRUD Handlers ---
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | undefined, name: string) => {
    if (!id) return;

    if (window.confirm(`Are you sure you want to delete the product: "${name}"?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Helper to find category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'N/A';
  };

  // --- Render Logic ---
  if (productsLoading || categoriesLoading) {
    return (
      <div className="p-8 text-center text-xl text-gray-500">Loading products and categories...</div>
    );
  }

  return (
    <div className="p-4 sm:p-8">

      {/* Header and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Inventory</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
          disabled={categories.length === 0} // Disable if no categories exist
        >
          <AddIcon />
          {categories.length === 0 ? "Add Category First" : "Add Product"}
        </button>
      </div>

      {/* Products Table (READ Operation) */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-3">
                      {product.productImage && (
                        <img src={product.productImage} alt={product.name} className="h-8 w-8 object-cover rounded-md" />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    PKR {product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.mg} mg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-gray-100 transition"
                      title="Edit Product"
                    >
                      <EditIcon />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition"
                      title="Delete Product"
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-lg">
                  No products found. Click 'Add Product' to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Render */}
      {isModalOpen && (
        <ProductForm
          productToEdit={editingProduct}
          categories={categories}
          onClose={closeModal}
        />
      )}
    </div>
  );
}