import "./globals.css";

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
      <body className="antialiased bg-[#D4FCBC]">{children}</body>
    </html>
  );
}

