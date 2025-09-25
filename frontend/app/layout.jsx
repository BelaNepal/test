import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserProvider } from '@/context/UserContext';
import { Mukta } from 'next/font/google';

const mukta = Mukta({
  subsets: ['devanagari'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'auto',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bela Nepal</title>
      </head>

      <body
        className={`min-h-screen flex flex-col overflow-x-hidden bg-white text-gray-900 ${mukta.className}`}
      >
        <UserProvider>
          {/* <Navbar /> */}
          <main className="flex-grow font-sans">{children}</main>
          {/* <Footer /> */}
        </UserProvider>
      </body>
    </html>
  );
}
