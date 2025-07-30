import '@/styles/globals.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bela Nepal Dashboard</title>
        {/* Add any global fonts or metadata here */}
        {/* If you need styles.css, use relative or CDN path in production */}
        {/* <link rel="stylesheet" href="/styles.css" /> */}
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-white text-gray-900">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
