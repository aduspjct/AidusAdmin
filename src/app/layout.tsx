import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aidus',
  description: 'Aidus Dashboard',
  icons: {
    icon: '/images/landing/logo/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts (Typekit) - Replace [YOUR_KIT_ID] with your Adobe Fonts kit ID */}
        {/* Make sure to add aidus.com to your allowed domains in Adobe Fonts settings */}
        <link rel="stylesheet" href="https://use.typekit.net/[YOUR_KIT_ID].css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

