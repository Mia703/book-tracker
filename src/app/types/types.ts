
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
export type Book = {
  googleBookId?: string;
  title?: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: {
    type: string;
    identifier: string;
  }[];
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  userInfo?: {
    readingProgress?: string;
    readingFormat?: string;
    startDate?: string;
    endDate?: string;
    rating?: string;
    comments?: string;
    userEmail: string;
    googleBook?: boolean;
    xata_createdat?: string;
    xata_id?: string;
    xata_updatedat?: string;
    xata_version?: number;
  };
}

export type LibraryList = {
  wishlist: Book[];
  reading: Book[];
  finished: Book[];
  dnf: Book[];
}