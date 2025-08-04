import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-50 p-8 overflow-hidden flex items-center justify-start">
      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/Logo-Bela.svg" // Replace with your logo path
          alt="Watermark Logo"
          width={500}
          height={500}
          className="opacity-5 object-contain"
        />
      </div>

      {/* Left-aligned Welcome Section */}
      <div className="relative z-10 max-w-xl text-left">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Welcome<span className="text-blue-600"> Bela-IMS</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Start managing your project with ease. Access your dashboard, track progress, and explore tools built just for you.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
