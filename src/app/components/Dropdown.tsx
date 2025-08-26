import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

type DropdownProps = {
  name: string;
  index: number;
  children: React.ReactNode;
};

export default function Dropdown({ name, index, children }: DropdownProps) {
  const [toggleTrigger, setToggleTrigger] = useState<boolean>(false);

  return (
    <AccordionItem key={index} value={`accordion-item-${index}`}>
      <AccordionTrigger
        className="w-full cursor-pointer p-4"
        onClick={() => {
          setToggleTrigger(!toggleTrigger);
        }}
      >
        <div className="flex flex-row justify-between">
          <h2 className="capitalize text-lg font-bold">{name}</h2>

          {/* FIXME: for dropdown of index 0 which starts out open */}
          {index == 0 &&
            (toggleTrigger ? (
              <ChevronRight className="text-primary-dark-pink" />
            ) : (
              <ChevronDown className="text-primary-dark-pink" />
              
            ))}

          {/* for all other drop downs that start off closed */}
          {index > 0 &&
            (toggleTrigger ? (
              <ChevronRight className="text-primary-dark-pink" />
            ) : (
              <ChevronDown className="text-primary-dark-pink" />
            ))}
        </div>
      </AccordionTrigger>
      <hr className="border-primary-dark-pink border-2" />
      <AccordionContent className="p-4">{children}</AccordionContent>
    </AccordionItem>
  );
}
