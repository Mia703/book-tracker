import { Book } from "../types/types";
import BookInfo from "./BookInfo";
import ResultsList from "./ResultsList";
import BookScreen from "./BookScreen";

type SearchResultsProps = {
  bookResults: Book[] | null;
};

export default function SearchResults({ bookResults }: SearchResultsProps) {
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
            screenTrigger={<ResultsList book={book} index={index} />}
          >
            <BookInfo book={book} userInfo={null} />
          </BookScreen>
        ))
      ) : (
        <p className="text-center">There are no books matching this query.</p>
      )}
    </div>
  );
}
