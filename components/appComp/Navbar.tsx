"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";
import { GithubLogo } from "@phosphor-icons/react";

const Navbar = () => {
  return (
    <nav className="h-20 flex items-center fixed top-0 w-full z-10 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between container mx-auto">
        <Link href="/" className="text-2xl font-bold">
          bobAi
        </Link>
        <div className="flex gap-4">
          <Link
            href="https://github.com/starc007/whiskey-agent"
            target="_blank"
            className="text-primary/80 hover:text-primary"
          >
            <GithubLogo size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
