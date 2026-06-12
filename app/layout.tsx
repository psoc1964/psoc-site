import "./globals.css";
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

import { SpeedInsights } from "@vercel/speed-insights/next";

import { ApolloWrapper } from "@/lib/apollo-client";
import { Injector } from "@/lib/apollo-server";
import { queryGQL } from "@/lib/apollo-server";
import { GlobalStateWrapper } from "@/lib/auth-client";
import { GET_CURRENT_USER } from "@/lib/queries";

import AuthApply from "./(public)/components/auth/auth-apply";
import TokenApply from "./(public)/components/auth/token-apply";
import SmoothScroll from "./providers/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PSoc · Photographic Society, BIT Mesra",
  description: "The official Photographic Society of Birla Institute of Technology, Mesra — dedicated to visual storytelling, photography, and preserving moments.",
  openGraph: {
    title: "PSoc · Photographic Society, BIT Mesra",
    description: "The official Photographic Society of Birla Institute of Technology, Mesra — dedicated to visual storytelling, photography, and preserving moments.",
    url: "https://psocbitm.com",
    siteName: "PSoc - Photographic Society, BIT Mesra",
    type: "website",
    images: [
      {
        url: "https://psocbitm.com/psoc-metadata-logo.png",
        width: 1200,
        height: 630,
        alt: "PSoc - Photographic Society, BIT Mesra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSoc · Photographic Society, BIT Mesra",
    description: "The official Photographic Society of Birla Institute of Technology, Mesra — dedicated to visual storytelling, photography, and preserving moments.",
    images: ["https://psocbitm.com/psoc-metadata-logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PSoc - Photographic Society, BIT Mesra",
  url: "https://psocbitm.com",
  logo: "https://psocbitm.com/psoc-metadata-logo.png",
  image: "https://psocbitm.com/psoc-metadata-logo.png",
  description:
    "The official Photographic Society of Birla Institute of Technology, Mesra — dedicated to visual storytelling, photography, and preserving moments.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="scroll-smooth no-scrollbar" lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col bg-black text-white overflow-x-hidden film-grain`}
      >
        <Toaster />
        <ApolloWrapper>
          <GlobalStateWrapper>
            <Injector
              fetch={async () => {
                try {
                  return await queryGQL(
                    GET_CURRENT_USER,
                    undefined,
                    await cookies(),
                    0,
                  );
                } catch {
                  return { user: null };
                }
              }}
              Component={AuthApply}
            />
            <Injector
              fetch={async () =>
                fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/email`, {
                  credentials: "include",
                  headers: {
                    Cookie: (await cookies()).toString(),
                  },
                })
                  .then((res) => res.text())
                  .catch(() => null)
              }
              Component={TokenApply}
            />
            <SmoothScroll>{children}</SmoothScroll>
          </GlobalStateWrapper>
        </ApolloWrapper>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}