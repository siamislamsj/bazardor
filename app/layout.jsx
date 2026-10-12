import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের বাজারদর এক নজরে",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>
        <Header />
        <main className="min-h-[75vh]">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
