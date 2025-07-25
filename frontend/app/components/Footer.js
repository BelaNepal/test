export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg text-center z-50"
      // Remove fixed height
    >
      <div className="py-3">
        <p className="text-sm font-semibold">&copy; {new Date().getFullYear()} Login App. All rights reserved.</p>
        <p className="mt-1 text-xs italic opacity-80">Built with ❤️ and Next.js</p>
      </div>
    </footer>
  );
}
