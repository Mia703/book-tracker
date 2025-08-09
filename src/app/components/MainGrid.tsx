import React from "react";

export default function MainGrid({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
    id="main-grid"
    className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-12"
  >
    {children}
  </div>
  );
}
