import { Book, LibraryList } from "@/app/types/types";
import { Dispatch, SetStateAction } from "react";

export function capitaliseSentence(string: string) {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats a search input string by encoding punctuation, currency, and symbol characters
 * as percent-encoded hexadecimal values, replacing spaces between non-space characters with '+',
 * and converting the result to lowercase.
 *
 * - Punctuation, currency, and symbol characters are replaced with `%XX` where `XX` is the
 *   uppercase hexadecimal Unicode code point of the character.
 * - Spaces between non-space characters are replaced with '+'.
 * - The entire string is converted to lowercase.
 *
 * @param searchInput - The input string to format for search.
 * @returns The formatted search string.
 */
export function googleBooks__formatSearch(searchInput: string) {
  return (
    searchInput
      // replace punctuation/currency/symbols with %XX
      .replace(/[\p{P}\p{S}]/gu, (char) => {
        const code = char.codePointAt(0);
        return `%${code?.toString(16).toUpperCase().padStart(2, "0")}`;
      })
      // replace spaces between characters with +
      .replace(/(?<=\S) +(?=\S)/g, "+")
      .toLowerCase()
  );
}

// TODO: use partial request to get only the information I need
// https://developers.google.com/books/docs/v1/performance

export async function googleBooks__fetchBook(limit: number, searchInput: string) {
  const searchResponse = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${googleBooks__formatSearch(searchInput)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    },
  );

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();

    const bookList: Book[] = searchData.items
      .slice(0, limit)
      //  eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => {
        return {
          googleBookId: item.id,
          title: item.volumeInfo?.title,
          subtitle: item.volumeInfo?.subtitle,
          authors: item.volumeInfo?.authors,
          publisher: item.volumeInfo?.publisher,
          publishedDate: item.volumeInfo?.publishedDate,
          description: item.volumeInfo?.description,
          industryIdentifiers: item.volumeInfo?.industryIdentifiers,
          pageCount: item.volumeInfo?.pageCount,
          categories: item.volumeInfo?.categories,
          imageLinks: item.volumeInfo?.imageLinks,
        };
      });

    return bookList;
  }
  return null;
}

export async function googleBooks__fetchBooksById(googleBookId: string, book: Book) {
  const searchResponse = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${googleBookId}?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    },
  );

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();

    // update the book's data
    book.title = searchData.volumeInfo?.title;
    book.subtitle = searchData.volumeInfo?.subtitle;
    book.authors = searchData.volumeInfo?.authors;
    book.publisher = searchData.volumeInfo?.publisher;
    book.publishedDate = searchData.volumeInfo?.publishedDate;
    book.description = searchData.volumeInfo?.description;
    book.industryIdentifiers = searchData.volumeInfo?.industryIdentifiers;
    book.pageCount = searchData.volumeInfo?.pageCount;
    book.categories = searchData.volumeInfo?.categories;
    book.imageLinks = searchData.volumeInfo?.imageLinks;
  }
  return book;
}

// determines the # of book data searched by google books api

export async function fetchBooksByReadingProgress(
  readingProgress: string,
  userEmail: string,
) {
  const batchSize = 3;

  const response = await fetch("/pages/api/books/getAllBooks", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ readingProgress, userEmail, batchSize }),
  });

  const data = await response.json();

  if (response.ok) {
    const booksList: Book[] = JSON.parse(data.message.getAllBooks);

    return booksList;
  } else {
    return [];
  }
}

export function modifyLibraryCache(
  setCache: Dispatch<SetStateAction<LibraryList>>,
  action: "add" | "update" | "delete",
  book: Book,
  currentList: keyof LibraryList | undefined,
  newList: keyof LibraryList,
) {

  // REMOVE BOOK FROM CURRENT READING LIST
  if (currentList) {
    setCache((prev) => ({
      ...prev,
      [currentList]: [
        ...prev[currentList].filter(
          (item: Book) => item.userInfo?.xata_id !== book.userInfo?.xata_id,
        ),
      ],
    }));
  }

  if (action === "add" || action === "update") {
    // ADD BOOK TO NEW READING LIST
    setCache((prev) => ({
      ...prev,
      [newList]: [...prev[newList], book],
    }));

    // SORT LIST BY UPDATEDAT, IF MISSING LEAVE ORDER UNCHANGED
    setCache((prev) => ({
      ...prev,
      [newList]: [
        ...prev[newList].sort((a, b) =>
          a.userInfo?.xata_updatedat && b.userInfo?.xata_updatedat
            ? new Date(b.userInfo?.xata_updatedat).getTime() -
              new Date(a.userInfo?.xata_updatedat).getTime()
            : 0,
        ),
      ],
    }));
  }

  // IF DELETE DO NOTHING, SINCE IT'S ALREADY REMOVED
}
