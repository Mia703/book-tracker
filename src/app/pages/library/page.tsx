"use client";
import Book from "@/app/components/Book";
import BookInfo from "@/app/components/BookInfo";
import BookScreen from "@/app/components/BookScreen";
import Dropdown from "@/app/components/Dropdown";
import MainGrid from "@/app/components/MainGrid";
import SearchBar from "@/app/components/SearchBar";
import { BooksList, UserInfo } from "@/app/types/types";
import { searchBook_ISBN } from "@/app/utils/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { useEffect, useState } from "react";

export default function Library() {
  const [results, setResults] = useState<BooksList>({
    wishlist: [],
    reading: [],
    finished: [],
    dnf: [],
  });

  // TODO: move to a separate file
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
        const userBooksList: UserInfo[] = JSON.parse(userBooksListData);
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

        const allResults: BooksList = {
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
              // forEach does not await async functions, so it returns values before the async can finish
              // for....of respects await, and map requires an await Promise.all
              for (const userBook of userBooksByReadingProgress) {
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
              }
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
              {results && results["reading"].length != 0 ? (
                <div className="books-wrapper horizontal-media-scroller">
                  {results["reading"].map((data, index) => (
                    <BookScreen
                      key={index}
                      screenTrigger={<Book key={index} book={data.book} />}
                    >
                      <BookInfo book={data.book} userInfo={data.userInfo} />
                    </BookScreen>
                  ))}
                </div>
              ) : (
                <p className="text-center">
                  You&apos;re not reading any books yet!
                </p>
              )}
            </Dropdown>

            <Dropdown name="Wish List" index={1}>
              {results && results["wishlist"].length != 0 ? (
                <div className="books-wrapper horizontal-media-scroller">
                  {results["wishlist"].map((data, index) => (
                    <BookScreen
                      key={index}
                      screenTrigger={<Book key={index} book={data.book} />}
                    >
                      <BookInfo book={data.book} userInfo={data.userInfo} />
                    </BookScreen>
                  ))}
                </div>
              ) : (
                <p className="text-center">
                  You don&apos;t have any books in your wish list!
                </p>
              )}
            </Dropdown>

            <Dropdown name="Finished" index={2}>
              {results && results["finished"].length != 0 ? (
                <div className="books-wrapper horizontal-media-scroller">
                  {results["finished"].map((data, index) => (
                    <BookScreen
                      key={index}
                      screenTrigger={<Book key={index} book={data.book} />}
                    >
                      <BookInfo book={data.book} userInfo={data.userInfo} />
                    </BookScreen>
                  ))}
                </div>
              ) : (
                <p className="text-center">
                  You&apos;re not reading any books!
                </p>
              )}
            </Dropdown>

            <Dropdown name="DNF" index={3}>
              {results && results["dnf"].length != 0 ? (
                <div className="books-wrapper horizontal-media-scroller">
                  {results["dnf"].map((data, index) => (
                    <BookScreen
                      key={index}
                      screenTrigger={<Book key={index} book={data.book} />}
                    >
                      <BookInfo book={data.book} userInfo={data.userInfo} />
                    </BookScreen>
                  ))}
                </div>
              ) : (
                <p className="text-center">You&apos;ve read all your books!</p>
              )}
            </Dropdown>
          </Accordion>
        </div>
      </section>
    </MainGrid>
  );
}
