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
export function formatSearch(searchInput: string) {
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

export async function fetchGoogleBooks(limit: number, searchInput: string) {
  const searchResponse = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${formatSearch(searchInput)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
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

export async function fetchGoogleBooks__ByID(googleBookId: string, book: Book) {
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

export async function fetchGoogleBooks__ByReadingProgress(
  readingProgress: string,
  userEmail: string,
  batchSize: number,
) {
  const response = await fetch("/pages/api/books/getAllBooks", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ readingProgress, userEmail }),
  });

  const data = await response.json();

  if (response.ok) {
    const booksList: Book[] = JSON.parse(data.message.getAllBooks);

    for (let i = 0; i < booksList.length; i += batchSize) {
      // slice a batch
      const batch = booksList.slice(i, i + batchSize);

      // run them in parallel for this batch
      await Promise.all(
        batch.map(async (book) => {
          await new Promise((res) => setTimeout(res, 200)); // wait 2 seconds

          if (book.googleBookId && book.userInfo?.googleBook) {
            await fetchGoogleBooks__ByID(book.googleBookId, book);
          }
        }),
      );
    }

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
  console.log(`${action} book from ${currentList} to ${newList}`);

  // remove from current list
  if (currentList) {
    console.log("modifyCache: remove book from list");
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
    console.log("modifyCache: add or update book to library cache");
    // ADD BOOK TO LIST
    setCache((prev) => ({
      ...prev,
      [newList]: [...prev[newList], book],
    }));

    // SORT LIST BY CREATEDATE, IF MISSING LEAVE ORDER UNCHANGED
    setCache((prev) => ({
      ...prev,
      [newList]: [
        ...prev[newList].sort((a, b) =>
          a.userInfo?.xata_createdat && b.userInfo?.xata_createdat
            ? new Date(b.userInfo?.xata_createdat).getTime() -
              new Date(a.userInfo?.xata_createdat).getTime()
            : 0,
        ),
      ],
    }));
  }

  // IF DELETE DO NOTHING, SINCE IT'S ALREADY REMOVED
}
