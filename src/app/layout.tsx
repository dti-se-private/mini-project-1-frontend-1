import RootProvider from "@/src/components/RootProvider";
import type {Metadata} from "next";
import "./globals.scss";
import Header from "@/src/components/Header";

export const metadata: Metadata = {
    title: "Eventee",
    description: "mini-project-1-frontend-1",
};

export default function Layout(
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
            <Header/>
            {children}
        </RootProvider>
        </body>
        </html>
    );
}