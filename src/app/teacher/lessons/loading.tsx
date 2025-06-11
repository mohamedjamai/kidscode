export default function LessonsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Lessen laden...
        </h2>
        <p className="text-gray-500">
          Een moment geduld
        </p>
      </div>
    </div>
  );
} 