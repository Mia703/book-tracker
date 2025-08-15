import { Book, GoogleBooksResponse } from "../types/types";

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

/**
 * Searches for books using the Google Books API and returns the top 5 results.
 *
 * @param searchInput - The search query string to look up books.
 * @returns A promise that resolves to an array of up to 5 `Book` objects matching the search input, or `null` if the request fails.
 *
 * @remarks
 * - Uses the Google Books API and requires a valid API key set in `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`.
 * - The search input is formatted using the `formatSearch` utility before being sent to the API.
 * - Only the first 5 results are returned.
 */
export async function searchBooks_Top5(searchInput: string) {
  let bookResults: Book[] | null = null;

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${formatSearch(searchInput)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    },
  );

  if (response.ok) {
    const data = await response.json();

    const booksList: Book[] = (data as GoogleBooksResponse).items
      .slice(0, 5)
      .map((item) => {
        const bookInfo = item.volumeInfo;

        return {
          title: bookInfo.title,
          subtitle: bookInfo.subtitle,
          authors: bookInfo.authors,
          description: bookInfo.description,
          categories: bookInfo.categories,
          imageLinks: bookInfo.imageLinks,
          industryIdentifiers: bookInfo.industryIdentifiers,
          pageCount: bookInfo.pageCount,
          publishedDate: bookInfo.publishedDate,
          publisher: bookInfo.publisher,
        };
      });

    bookResults = booksList;
  } else {
    bookResults = null;
  }

  return bookResults;
}

export async function searchBook_ISBN(searchInput: string) {
   let bookResults: Book[] | null = null;

   const response = await fetch(
     `https://www.googleapis.com/books/v1/volumes?q=${formatSearch(`isbn:${searchInput}`)}&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`,
     {
       method: "GET",
       headers: { "Content-type": "application/json" },
     },
   );

   if (response.ok) {
     const data = await response.json();

     const booksList: Book[] = (data as GoogleBooksResponse).items
       .slice(0)
       .map((item) => {
         const bookInfo = item.volumeInfo;

         return {
           title: bookInfo.title,
           subtitle: bookInfo.subtitle,
           authors: bookInfo.authors,
           description: bookInfo.description,
           categories: bookInfo.categories,
           imageLinks: bookInfo.imageLinks,
           industryIdentifiers: bookInfo.industryIdentifiers,
           pageCount: bookInfo.pageCount,
           publishedDate: bookInfo.publishedDate,
           publisher: bookInfo.publisher,
         };
       });

     bookResults = booksList;
   } else {
     bookResults = null;
   }

   return bookResults;
}
