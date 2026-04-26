import AdminProductForm from "../../components/AdminProductForm";
import { useParams } from "react-router-dom";

export default function ProductEdit() {
  const { id } = useParams();
  
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <AdminProductForm productId={id} />
    </main>
  );
}