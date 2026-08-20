import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";

import { Toaster } from "sonner";

export const metadata = {
    title: "Todo App",
    description: "Todo Microservices",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>

                <Toaster richColors />
            </body>
        </html>
    );
}
