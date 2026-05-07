// src/components/FormMessage.jsx
export default function FormMessage({ message, type = "success" }) {
  if (!message) return null;

  const tone =
    type === "success"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";

  return (
    <div className={`rounded border px-4 py-3 text-sm ${tone}`}>
      <div className="flex items-center">
        <span className="mr-2">{type === "success" ? "OK" : "Error"}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
