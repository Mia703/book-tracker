import { Book as BookType } from "../types/types";

type BookProps = {
  book: BookType;
};
export default function Book({ book }: BookProps) {
  return <div className="book-wrapper">
		insert info here
	</div>;
}
