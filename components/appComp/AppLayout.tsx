"use client";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto mt-20 px-4 h-[calc(100vh-5rem)]">
      {children}
    </main>
  );
};

export default AppLayout;
