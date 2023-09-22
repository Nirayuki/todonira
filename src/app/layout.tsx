'use client'
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Layout } from '@/components/Layout';
import { Providers } from '@/providers/providers';
import {useState} from 'react';
import { usePathname } from 'next/navigation';
import { checkIsPublicRoute } from '@/functions/check-is-public-route';
import PrivateRoute from '@/components/PrivateRoute';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isPublic = checkIsPublicRoute(pathname!);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <Layout>
            {isPublic && children}
            {!isPublic && (
              <PrivateRoute>{children}</PrivateRoute>
            )}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
