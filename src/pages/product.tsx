/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../app/store";
// import { startProductsRealtime, addProduct, updateProduct, deleteProduct } from "../features/products/productsSlice";

const ProductsPage = () => {
  // const dispatch = useDispatch<AppDispatch>();
  //   const { products, loading } = useSelector((state: RootState) => state.products);

  // useEffect(() => {
  //   const unsubscribe: any = dispatch(startProductsRealtime());
  //   return () => unsubscribe?.(); // Stop realtime listener on unmount
  // }, []);

  // const handleAdd = () => dispatch(addProduct({ name: "New Product", price: 50, category: "Category 1" }));
  // const handleUpdate = (id: string) => dispatch(updateProduct({ id, name: "Updated Product", price: 100, category: "Category 2" }));
  // const handleDelete = (id: string) => dispatch(deleteProduct(id));

  //   if (loading) return <p>Loading...</p>;



  return (
    // <div className="p-4">
    //   <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded mb-4">Add Product</button>
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //     {products.map(p => (
    //       <div key={p.id} className="p-4 border rounded shadow">
    //         <h2 className="font-semibold">{p.name}</h2>
    //         <p>Price: ${p.price}</p>
    //         <p>Category: {p.category}</p>
    //         <div className="flex space-x-2 mt-2">
    //           <button onClick={() => handleUpdate(p.id!)} className="px-2 py-1 bg-green-500 text-white rounded">Edit</button>
    //           <button onClick={() => handleDelete(p.id!)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>

      asdf
    </div>

  );
};

export default ProductsPage;
