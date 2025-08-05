import '@/styles/globals.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/UserContext"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bela Nepal Dashboard</title>
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-white text-gray-900">
        <UserProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
