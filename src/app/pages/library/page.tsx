"use client";
import Book from "@/app/components/Book";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { Book as BookType, UserBook } from "@/app/types/types";
import { searchBook_ISBN } from "@/app/utils/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";

type BookResult = {
  userInfo: UserBook;
  book: BookType;
};

type Results = {
  wishlist: BookResult[];
  reading: BookResult[];
  finished: BookResult[];
  dnf: BookResult[];
};

export default function Library() {
  const [results, setResults] = useState<Results>({
    wishlist: [],
    reading: [],
    finished: [],
    dnf: [],
  });

  useEffect(() => {
    async function getAllBooksByReadingProgress(
      userEmail: string,
      readingProgress: string,
    ) {
      const response = await fetch(
        "/pages/api/books/getAllBooksByReadingProgress",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            userEmail: userEmail,
            readingProgress,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // return the list of books from the user's db
        const userBooksListData = data.message.booksList;
        const userBooksList: UserBook[] = JSON.parse(userBooksListData);
        return userBooksList;
      }
      return null;
    }

    const cached = window.sessionStorage.getItem("userBookData");
    if (cached) {
      setResults(JSON.parse(cached));
    } else {
      const userData = window.sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);

        const allResults: Results = {
          wishlist: [],
          reading: [],
          finished: [],
          dnf: [],
        };

        // Because of the 'as const', ts infers this array as a tuple of literal types instead of string[]
        const readingProgress = [
          "wishlist",
          "reading",
          "finished",
          "dnf",
        ] as const;

        // Use Promise.all to wait for all readingProgress fetches
        Promise.all(
          readingProgress.map(async (progress) => {
            await new Promise((res) => setTimeout(res, 200));

            const userBooksByReadingProgress =
              await getAllBooksByReadingProgress(user.email, progress);

            if (
              userBooksByReadingProgress &&
              userBooksByReadingProgress.length != 0
            ) {
              userBooksByReadingProgress.forEach(async (userBook) => {
                if (userBook.isbn) {
                  // await each API call sequentially with a delay between each all to avoid spamming the Google Books API
                  // Note: if you call the API too quickly and too many times, a 429 (Too Many Requests) Error returns
                  await new Promise((res) => setTimeout(res, 200));

                  // search for the book using the Google Books API
                  // returns an array with a length of 1
                  const googleBooks = await searchBook_ISBN(userBook.isbn);

                  if (googleBooks) {
                    const googleBook = googleBooks[0];

                    // save the book
                    allResults[progress].push({
                      userInfo: userBook,
                      book: googleBook,
                    });
                  }
                } else {
                  // TODO: handle books without ISBN
                }
              });
            }
          }),
        ).then(() => {
          window.sessionStorage.setItem(
            "userBookData",
            JSON.stringify(allResults),
          );
          setResults(allResults);
        });
      }
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
            <Dropdown name="Reading" index={0}>
              <div className="book-wrapper grid auto-cols-fr">
                {results && results["reading"].length != 0 ? (
                  results["reading"].map((data, index) => (
                    <Book
                      book={data.book}
                      userInfo={data.userInfo}
                      key={index}
                    />
                  ))
                ) : (
                  <p>You&apos;re not reading any books!</p>
                )}
              </div>
            </Dropdown>

            <Dropdown name="Wish List" index={1}>
              <div className="book-wrapper grid auto-cols-fr">
                {results && results["wishlist"].length != 0 ? (
                  results["wishlist"].map((data, index) => (
                    <Book
                      book={data.book}
                      userInfo={data.userInfo}
                      key={index}
                    />
                  ))
                ) : (
                  <p>You don&apos;t have any books in your wish list!</p>
                )}
              </div>
            </Dropdown>

            <Dropdown name="Finished" index={2}>
              <div className="book-wrapper grid auto-cols-fr gap-2">
                {results && results["finished"].length != 0 ? (
                  results["finished"].map((data, index) => (
                    <Book
                      book={data.book}
                      userInfo={data.userInfo}
                      key={index}
                    />
                  ))
                ) : (
                  <p>You&apos;re not reading any books!</p>
                )}
              </div>
            </Dropdown>

            {/* TODO: format to be horizontal scroll */}
            <Dropdown name="DNF" index={3}>
              <div className="book-wrapper grid auto-cols-fr">
                {results && results["dnf"].length != 0 ? (
                  results["dnf"].map((data, index) => (
                    <Book
                      book={data.book}
                      userInfo={data.userInfo}
                      key={index}
                    />
                  ))
                ) : (
                  <p>You&apos;ve read all your books!</p>
                )}
              </div>
            </Dropdown>
          </Accordion>
        </div>
      </section>
    </MainGrid>
  );
}
