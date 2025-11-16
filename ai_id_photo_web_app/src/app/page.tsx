"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SignIn from "./signIn/page";
import GeneratorPage from "./generator/page";
import UserProfilePage from "./profile/page";
import UserProfileHistoryPage from "./history/page";
import Navigation from "./NavigationBar/navigation";
import { UserProvider } from "../contexts/UserContext";
import LandingPage from "./landingPage/page";
import ResetPassword from "./resetPassword/page";

const Page = () => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(<LandingPage />);

  useEffect(() => {
    const renderPage = () => {
      switch (pathname) {
        case "/":
        case "/landingPage":
          return <LandingPage />;
        case "/generator":
          return (
            <>
              <Navigation />
              <GeneratorPage />
            </>
          );
        case "/profile":
          return (
            <>
              <Navigation />
              <UserProfilePage />
            </>
          );
        case "/history":
          return (
            <>
              <Navigation />
              <UserProfileHistoryPage />
            </>
          );
        case "/signIn":
          return <SignIn />;
        case "/resetPassword":
          return <ResetPassword />;
        default:
          return <LandingPage />;
      }
    };

    setCurrentPage(renderPage());
  }, [pathname]);

  return <UserProvider>{currentPage}</UserProvider>;
};

export default Page;
