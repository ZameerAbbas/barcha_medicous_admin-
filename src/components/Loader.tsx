export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 opacity-30" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent animate-spin" />
      </div>

      {/* Animated text */}
      <p className="text-gray-500 text-lg font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}
