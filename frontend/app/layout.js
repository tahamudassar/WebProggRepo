import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/CustomHeader";

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mx-auto max-w-[1200px] w-full relative overflow-hidden">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
