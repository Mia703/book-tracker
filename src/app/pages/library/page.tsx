"use client";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { Accordion } from "@radix-ui/react-accordion";

export default function Library() {
  // const dropdownList = ["Reading", "Wish List"];

  return (
    <MainGrid>
      <SearchBar />

      <section
        id="accordion-section"
        className="col-span-4 md:col-span-6 lg:col-span-12"
      >
        <div className="accordion-wrapper w-full">
          <Accordion type="single" collapsible>
            {/* accordion items - option 1*/}
            {/* {dropdownList.map((item, index) => (
              <Dropdown name={item} index={index} key={index}>animals</Dropdown>
            ))} */}

            {/* accordion items - option 2 */}
            <Dropdown name="Reading" index={0}>
              books here
            </Dropdown>

            <Dropdown name="Wish List" index={1}>
              books here
            </Dropdown>

            <Dropdown name="Finished" index={2}>
              books here
            </Dropdown>

            <Dropdown name="DNF" index={3}>
              books here
            </Dropdown>
          </Accordion>
        </div>
      </section>
    </MainGrid>
  );
}
