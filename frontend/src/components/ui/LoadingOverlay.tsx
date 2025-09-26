// src/components/ui/LoadingOverlay.tsx
export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-[9999]">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-navy font-medium text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
}
