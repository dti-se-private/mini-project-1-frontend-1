import RootProvider from "@/src/components/RootProvider";
import type {Metadata} from "next";
import "./globals.scss";

export const metadata: Metadata = {
    title: "Eventee",
    description: "mini-project-1-frontend-1",
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) {
    return (
        <html lang="en">
        <body>
        <RootProvider>
            {children}
        </RootProvider>
        </body>
        </html>
    );
}