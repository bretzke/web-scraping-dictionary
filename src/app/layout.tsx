import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Dicionário pt-BR</title>
      </head>
      <body className="antialiased bg-[#D4FCBC] p-8 pb-1 flex flex-col gap-8 min-h-screen">
        {children}

        <footer className="grow flex justify-center items-end">
          <Link
            href="https://bretzke.dev"
            target="_blank"
            className="underline"
          >
            Willian Bretzke © 2024
          </Link>
        </footer>
      </body>
    </html>
  );
}

