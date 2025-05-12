import localFont from "next/font/local";
import "../globals.css";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import RightSidebar from "@/components/shared/RightSidebar";
import { Bottombar } from "@/components/shared/BottomSidebar";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SignedOut>
              <div className="flex justify-center items-center h-screen">
                <SignIn routing="hash" />
              </div>
            </SignedOut>

            <SignedIn>
              {/* Fixed Topbar */}
              <Topbar />

              {/* Full height layout */}
              <div className="flex h-[calc(100vh-4rem)]">
                {/* Fixed Sidebar */}
                <LeftSidebar />


                {/* Main content scrolls */}
                <main
                  id="main-scroll-container"
                  className="flex-1 overflow-y-scroll px-4 py-6 bg-background text-foreground"
                  style={{ scrollbarGutter: "stable" }}
                >
                  <div className="w-full max-w-4xl mx-auto">
                    {children}
                  </div>
                </main>

              </div>

              <Bottombar />
            </SignedIn>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}