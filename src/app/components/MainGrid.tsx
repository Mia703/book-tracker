import React from "react";

type MainGridProps = {
  children: React.ReactNode;
};

export default function MainGrid({ children }: MainGridProps) {
  return (
    <section
      id="main-grid"
      className="grid grid-cols-4 gap-4 p-4 md:grid-cols-6 lg:grid-cols-12"
    >
      {children}
    </section>
  );
}
