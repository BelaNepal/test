import Link from "next/link";
import Image from "next/image";
import NepaliCalendar from "./components/NepaliCalendar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-50 p-8 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
      {/* Watermark Logo - bigger, centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[700px] h-[700px]">
          <Image
            src="/Logo-Bela.svg"
            alt="Watermark Logo"
            fill
            className="opacity-5 object-contain"
            style={{ userSelect: "none" }}
            priority
          />
        </div>
      </div>

      {/* Left-aligned Welcome Section */}
      <div className="relative z-10 max-w-xl text-left">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Welcome to<span className="text-blue-600"> Bela-IMS</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Start managing your project with ease. Access your dashboard, track progress, and explore tools built just for you.
        </p>
        <Link
          href="/login"
          className="relative inline-block bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-[#ef7e1f] focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go to Login
        </Link>
      </div>

      {/* Right-aligned Nepali Calendar - slightly bigger width */}
      <div className="relative z-10 w-full md:max-w-lg md:flex-none mt-8">
        <div className="scale-95 origin-top">
          <NepaliCalendar />
        </div>
      </div>
    </div>
  );
}
