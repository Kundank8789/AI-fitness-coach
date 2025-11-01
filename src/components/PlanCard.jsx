// src/components/PlanCard.jsx
export default function PlanCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
