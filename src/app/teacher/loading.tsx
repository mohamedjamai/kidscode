export default function TeacherLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Laden...
        </h2>
        <p className="text-gray-500">
          Het docentenportaal wordt geladen
        </p>
      </div>
    </div>
  );
} 