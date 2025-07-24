import '@/styles/globals.css'; // Import global styles
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Global metadata, fonts, styles, etc. */}
        <link rel="stylesheet" href="http://localhost:5000/styles.css" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
