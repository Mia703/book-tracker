// an outline of what could possibly be returned from the Google Books API GET request
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

// what I'm storing for my purposes (which is just a copy from GoogleBookItem)
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
