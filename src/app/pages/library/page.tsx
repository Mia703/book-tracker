"use client";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { Book, GoogleBooksResponse, UserBook } from "@/app/types/types";
import { searchBook_ISBN } from "@/app/utils/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";

export default function Library() {
 
  useEffect(() => {
    async function getAllBooksByType(
      userEmail: string,
      readingProgress: string,
    ) {
      const response = await fetch("/pages/api/books/getAllBooksByType", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail,
          readingProgress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userBooksListData = data.message.booksList;
        const userBooksList: UserBook[] = JSON.parse(userBooksListData);

        // if the array isn't empty, for each item search the book on Google Books API
        userBooksList.forEach(async (userBook) => {
          if (userBook.isbn) {
            // await each API call sequentially with a delay between each call to avoid spamming the Google Books API
            // if you call the API too quickly too many times, you get 429 (Too Many Requests) error
            await new Promise((res) => setTimeout(res, 200)); // delay 200ms
            const googleBookData = await searchBook_ISBN(userBook.isbn);

            const googleBook = googleBookData ? googleBookData[0] : null;

            if (readingProgress == "finished") {
              // TODO: save data here...
            
            }
          }
        });
      }
    }

    const userData = window.sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      ["reading", "wish list", "finished", "dnf"].forEach((item) => {
        getAllBooksByType(user.email, item);
      });
    }
  }, []);

  return (
    <MainGrid>
      <SearchBar />

      <section
        id="accordion-section"
        className="col-span-4 md:col-span-6 lg:col-span-12"
      >
        <div className="accordion-wrapper w-full">
          <Accordion type="single" collapsible defaultValue="accordion-item-0">
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
