import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to the Login App
      </h1>
      <h3 className="text-lg mb-6">This Welcome is from frontend/page</h3>
      <Link href="/login" className="text-blue-500 hover:underline">
        Go to Login
      </Link>
    </div>
  );
}
