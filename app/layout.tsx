import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import '../styles/globals.css';

const title = 'ゴムのアヒルちゃん';
const description = 'AIでラバーダッキングをしよう!';

export const metadata: Metadata = {
  metadataBase: new URL('https://rubberduck-copilot.vercel.app'),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: 'ja_JA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
