import { Book, LibraryList } from "../types/types";
import BookInfo from "./BookInfo";
import BookScreen from "./BookScreen";
import { Dispatch, SetStateAction } from "react";
import SearchList from "./SearchList";

type SearchResultsProps = {
  bookList: Book[] | null;
  setCache: Dispatch<SetStateAction<LibraryList>>;
};

export default function SearchResults({
  bookList,
  setCache,
}: SearchResultsProps) {
  return (
    <div
      id="search-results"
      className="bg-primary-light-pink border-primary-dark-pink absolute left-0 z-10 flex h-[55vh] flex-col gap-4 overflow-y-scroll rounded-b-md border-r-2 border-b-2 border-l-2 p-4 shadow-md"
      style={{ width: "100%" }}
    >
      {bookList ? (
        bookList?.map((book, index) => (
          <BookScreen
            key={index}
            // what's displayed under the search bar
            screenTrigger={<SearchList key={index} book={book} index={index} />}
          >
            {/* What's displayed on each click of a search bar item */}
            <BookInfo book={book} setCache={setCache} />
          </BookScreen>
        ))
      ) : (
        <p className="text-center">There are no books matching this query.</p>
      )}
    </div>
  );
}
