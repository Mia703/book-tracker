"use client";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Library() {
  const readingTypes = ["reading", "wish list", "finished", "dnf"];
  const [toggleTrigger, setToggleTrigger] = useState<boolean>(false);

  return (
    <MainGrid>
      <SearchBar />

      <section
        id="accordion-section"
        className="col-span-4 md:col-span-6 lg:col-span-12"
      >
        <div className="accordion-wrapper w-full">
          <Accordion type="single" collapsible defaultValue="accordion-item-0">
            {readingTypes.map((type, index) => (
              <AccordionItem key={index} value={`accordion-item-${index}`}>
                <AccordionTrigger
                  className="w-full cursor-pointer p-4"
                  onClick={() => {
                    // TODO: how do I only change the accordion item I clicked rather than all of them?
                    setToggleTrigger(!toggleTrigger);
                  }}
                >
                  <div className="flex flex-row justify-between">
                    <h2 className="capitalize">{type}</h2>

                    {toggleTrigger ? (
                      <ChevronRight className="text-primary-dark-pink" />
                    ) : (
                      <ChevronDown className="text-primary-dark-pink" />
                    )}
                  </div>
                </AccordionTrigger>
                <hr className="border-primary-dark-pink border-2" />
                <AccordionContent className="p-4">
                  Insert books component here
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MainGrid>
  );
}
