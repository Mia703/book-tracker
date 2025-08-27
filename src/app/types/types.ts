/**
 * Represents an outline of single book item retrieved from the Google Books API.
 *
 * @remarks
 * This interface models the structure of the `volumeInfo` object returned by Google Books.
 *
 * @property volumeInfo - Contains detailed information about the book, such as title, authors,
 * description, categories, images, identifiers, page count, publication date, and publisher.
 */
interface GoogleBookItem {
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    pageCount?: number;
    publishedDate?: string;
    publisher?: string;
  };
}

/**
 * Represents a series of GoogleBookItem(s)
 */
export interface GoogleBooksResponse {
  items: GoogleBookItem[];
}

/**
 * Represents a book with various metadata fields.
 * Modelled after the interface GoogleBookItem, just excludes the initial volumeInfo.
 *
 * @property title - The title of the book.
 * @property subtitle - The subtitle of the book (optional).
 * @property authors - An array of author names (optional).
 * @property description - A description or summary of the book (optional).
 * @property categories - An array of category names or genres (optional).
 * @property imageLinks - An object containing URLs for book cover images (optional).
 * @property imageLinks.smallThumbnail - URL for a small thumbnail image (optional).
 * @property imageLinks.thumbnail - URL for a thumbnail image (optional).
 * @property industryIdentifiers - An array of industry identifier objects, such as ISBN (optional).
 * @property industryIdentifiers.type - The type of identifier (e.g., "ISBN_13").
 * @property industryIdentifiers.identifier - The identifier value.
 * @property pageCount - The number of pages in the book (optional).
 * @property publishedDate - The publication date of the book (optional).
 * @property publisher - The publisher of the book (optional).
 */
export interface Book {
  title: string;
  subtitle?: string;
  authors?: string[];
  description?: string;
  categories?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  industryIdentifiers?: {
    type: string;
    identifier: string;
  }[];
  pageCount?: number;
  publishedDate?: string;
  publisher?: string;
}
/**
 * Represents book information stored in the Xata DB.
 * Contains information used to track a user's reading progress.
 *
 * @property readingProgress - a selection of one the following: ["reading", "wishlist", "finished", "dnf"]
 * @property isbn - The book's ISBN number
 * @property rating - The user's rating of the book, from one of the following selection:
 * ["masterpiece", "great", "good", "average", "appalling"]
 * @property readingFormat - How the user is reading the book, from one of the following selection:
 * ["eBook", "paper", "libraryLoan", "audio"]
 * @property startDate - The date the user started reading the book
 * @property endDate - The date the user finished reading the book
 * @property user - The user's email, which is attached to the user's login-information
 * @property comments - Any comments the user has about the book
 * @property bookImage - URL for the thumbnail image of the book, from the Google Books API
 *
 * Information provided by Xata DB:
 * @property xata_id
 * @property xata_createdat
 * @property xata_updatedat
 * @property xata_version
 */
export interface UserInfo {
  readingProgress: string;
  isbn: string | null;
  rating: string | null;
  readingFormat: string | null;
  startDate: string | null;
  endDate: string | null;
  user: string;
  comments: string | null;
  bookImage: string | null;
  xata_id: string;
  xata_createdat: string;
  xata_updatedat: string;
  xata_version: number;
}

export type BookInformation = {
  book: Book;
  userInfo: UserInfo;
};

export type BooksList = {
  wishlist: BookInformation[];
  reading: BookInformation[];
  finished: BookInformation[];
  dnf: BookInformation[];
};
