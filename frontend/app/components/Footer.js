export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-6 shadow-lg text-center">
      <p className="text-sm font-semibold">&copy; {new Date().getFullYear()} Login App. All rights reserved.</p>
      <p className="mt-2 text-xs italic opacity-80">Built with ❤️ and Next.js</p>
    </footer>
  );
}
