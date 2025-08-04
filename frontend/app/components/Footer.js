export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 backdrop-blur-md bg-[#fdf2e9]/90 text-[#1e2d4d] shadow-[0_-1px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            &copy; {new Date().getFullYear()} Bela-IMS
          </span>
          <span className="hidden sm:inline-block text-gray-500 font-normal">
            All rights reserved.
          </span>
        </div>

        {/* Right Side */}
        <div className="mt-1 sm:mt-0 text-xs italic text-gray-600 flex items-center gap-1">
          <span className="hidden sm:inline">Built with</span>
          <span className="text-[#f97316] animate-pulse">❤️</span>
          <span className="hidden sm:inline text-gray-700">+ Next.js</span>
        </div>
      </div>

      {/* Gradient Accent Border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#f97316] via-white/30 to-[#f97316] opacity-90" />
    </footer>
  );
}
