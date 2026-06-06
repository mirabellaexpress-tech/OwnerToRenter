import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://frontend-omigees-projects.vercel.app"),
  title: "OwnerToRenter | Direct Owner Rent in Pakistan - Zero Broker Commission",
  description: "Rent houses, apartments, shops, offices, cars, and bikes directly from verified owners in Islamabad, Rawalpindi & Pakistan. Save broker commissions completely.",
  keywords: [
    "rent house Islamabad",
    "direct owner rent Pakistan",
    "no broker commission rent",
    "bachelor allowed rooms Rawalpindi",
    "commercial shops for rent",
    "rent agreement maker Pakistan",
    "verified owner rental website",
    "rent estimator Islamabad"
  ],
  authors: [{ name: "OwnerToRenter Team" }],
  creator: "OwnerToRenter Team",
  publisher: "OwnerToRenter",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://frontend-omigees-projects.vercel.app",
    title: "OwnerToRenter | Direct Owner Rent in Pakistan",
    description: "Rent properties, cars, and bikes directly from verified owners in Pakistan without brokers or commission fees.",
    siteName: "OwnerToRenter",
    images: [
      {
        url: "/vercel.svg",
        width: 800,
        height: 600,
        alt: "OwnerToRenter Direct Rental Portal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OwnerToRenter | Direct Owner Rent in Pakistan",
    description: "No brokers, no commission fees. Connect directly with property owners.",
    images: ["/vercel.svg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OwnerToRenter",
  "url": "https://frontend-omigees-projects.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://frontend-omigees-projects.vercel.app/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
