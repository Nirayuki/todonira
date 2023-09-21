'use client'

import { AuthProvider } from "@/components/authContext"
import React from "react"

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>
}