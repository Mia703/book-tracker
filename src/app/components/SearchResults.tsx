import { Book, BooksList } from "../types/types";
import BookInfo from "./BookInfo";
import ResultsList from "./ResultsList";
import BookScreen from "./BookScreen";
import { Dispatch, SetStateAction } from "react";

type SearchResultsProps = {
  bookResults: Book[] | null;
  setResults: Dispatch<SetStateAction<BooksList>>;
};

export default function SearchResults({ bookResults, setResults }: SearchResultsProps) {
  return (
    <div
      id="search-results"
      className="bg-primary-light-pink border-primary-dark-pink absolute left-0 z-10 flex h-[55vh] flex-col gap-4 overflow-y-scroll rounded-b-md border-r-2 border-b-2 border-l-2 p-4 shadow-md"
      style={{ width: "100%" }}
    >
      {bookResults ? (
        bookResults?.map((book, index) => (
          <BookScreen
            key={index}
            screenTrigger={<ResultsList book={book} index={index} />} // what's displayed under the search bar
          >
            {/* What's displayed on each click of a search bar item */}
            <BookInfo book={book} userInfo={null} setResults={setResults}/>
          </BookScreen>
        ))
      ) : (
        <p className="text-center">There are no books matching this query.</p>
      )}
    </div>
  );
}
