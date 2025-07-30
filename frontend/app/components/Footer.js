export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#1e2d4d] text-white shadow-lg z-50">
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">
            &copy; {new Date().getFullYear()} Bela-IMS
          </span>
          <span className="hidden sm:inline-block text-xs text-gray-300">
            All rights reserved.
          </span>
        </div>

        <div className="mt-2 sm:mt-0 text-xs italic text-gray-300 flex items-center gap-1">
          <span>Built with</span>
          <span className="text-[#ef7e1a] animate-pulse">❤️</span>
          <span>+ Next.js</span>
        </div>
      </div>

      {/* Optional top gradient border for style */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ef7e1a] via-white/10 to-[#ef7e1a] opacity-80" />
    </footer>
  );
}
