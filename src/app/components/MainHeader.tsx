import React from "react";
import Logo from "@/components/Logo";

const MainHeader = () => {
  return (
    <header className="flex justify-center items-center py-8 px-6 bg-transparent animate-fade-in">
      <Logo width={140} priority={true} variant="white" />
    </header>
  );
};

export default MainHeader; 