export default function Copyright() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Copyright Notice</h1>
      <p className="text-gray-700 mb-4">
        © {new Date().getFullYear()} Koala T-Shirts. All rights reserved.
      </p>
      <p className="text-gray-700 mb-4">
        All content, including images, logos, and product descriptions, are the
        intellectual property of Koala T-Shirts unless otherwise stated. Unauthorized
        use, reproduction, or distribution is strictly prohibited.
      </p>
      <p className="text-gray-700">
        For permissions or licensing inquiries, please contact our support team.
      </p>
    </div>
  );
}