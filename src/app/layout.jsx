import { JetBrains_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Navigation } from "@/components/public/Navigation";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/public/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  display: "swap",
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  title: "Rahmat Ardiansyah",
  description:
    "Portofolio dan blog Rahmat Ardiansyah, tempat berbagi catatan, proyek, dan eksperimen seputar pengembangan web modern, teknologi digital, dan produktivitas kreatif.",
  keywords: [
    "Rahmat Ardiansyah",
    "Rahmat",
    "Portofolio",
    "Web",
    "Developer",
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
