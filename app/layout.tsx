import Link from 'next/link';
export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <nav>
        <Link href="/">Home</Link>
        <Link href="/chatgpt">ChatGPT</Link>
        <Link href="/tools/strings">String Utils</Link>
      </nav>
      <body>{children}</body>
    </html>
  )
}
