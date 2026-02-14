import type { Metadata } from "next";
import { JetBrains_Mono, Sora, Syne } from "next/font/google";
import { profile, siteConfig } from "@/data/profile";
import "./globals.css";

const syne = Syne({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const ogImage = "/og-image.svg";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${profile.personal.name} | ${profile.personal.roles[0]}`,
    template: `%s | ${profile.personal.name}`,
  },
  applicationName: profile.personal.name,
  description: profile.about,
  keywords: [
    profile.personal.name,
    profile.personal.location,
    ...profile.personal.roles,
    ...profile.skills.frontend,
    ...profile.skills.backend,
  ],
  authors: [{ name: profile.personal.name, url: siteConfig.baseUrl }],
  creator: profile.personal.name,
  publisher: profile.personal.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "profile",
    firstName: profile.personal.name.split(" ")[0],
    lastName: profile.personal.name.split(" ").slice(1).join(" "),
    username: profile.personal.name,
    url: siteConfig.baseUrl,
    siteName: profile.personal.name,
    title: `${profile.personal.name} | ${profile.personal.roles[0]}`,
    description: profile.about,
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.personal.name} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${siteConfig.authorHandle}`,
    creator: `@${siteConfig.authorHandle}`,
    title: `${profile.personal.name} | ${profile.personal.roles[0]}`,
    description: profile.about,
    images: [ogImage],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.png",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.personal.name,
  jobTitle: profile.personal.roles.join(", "),
  description: profile.about,
  email: `mailto:${profile.personal.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.personal.location,
    addressRegion: "Odisha",
    addressCountry: "India",
  },
  sameAs: [
    profile.profiles.github.url,
    profile.profiles.linkedin.url,
  ],
  url: siteConfig.baseUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${sora.variable} ${jetBrains.variable} antialiased`}>
        <div className="stellar-bg" aria-hidden="true">
          <div className="stellar-gradient" />
          <div className="stellar-orb orb-one" />
          <div className="stellar-orb orb-two" />
        </div>
        {children}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
