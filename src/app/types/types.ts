// an outline of what could possibly be returned from the Google Books API GET request
/**
 * Represents a single book item retrieved from the Google Books API.
 *
 * @remarks
 * This interface models the structure of the `volumeInfo` object returned by Google Books.
 *
 * @property volumeInfo - Contains detailed information about the book, such as title, authors, description, categories, images, identifiers, page count, publication date, and publisher.
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

export interface UserBook {
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