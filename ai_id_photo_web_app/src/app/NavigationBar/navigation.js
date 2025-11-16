// components/NavigationBar.js
import React from "react";
import Link from "next/link"; // Use Next.js's Link component
import { usePathname } from 'next/navigation'
import "./navigation.css";

const NavigationBar = () => {
    const pathname = usePathname(); // Get the current pathname

    return (
        <aside className="leftSidebar">
            <div className="spacer" />
            <Link href="/generator" passHref>
                <div className={`icon ${pathname === "/generator" ? "active" : ""}`}>
                    <i className="fas fa-wand-magic-sparkles" />
                </div>
            </Link>
            <Link href="/profile" passHref>
                <div className={`icon ${pathname === "/profile" ? "active" : ""}`}>
                    <i className="fa-solid fa-grip" />
                </div>
            </Link>
            <Link href="/history" passHref>
                <div className={`icon ${pathname === "/history" ? "active" : ""}`}>
                    <i className="fas fa-file-alt" />
                </div>
            </Link>
        </aside>
    );
};

export default NavigationBar;
