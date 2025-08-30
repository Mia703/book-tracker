import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";
import Book from "@/app/components/Book";
import UserInfo from "@/app/components/Book";

export async function POST(request: Request) {
  try {
    const { book, userInfo } = await request.json();

    if (!book || !userInfo) {
      return NextResponse.json(
        { message: {
          developerMessage: "CreateBook: book and userInfo are required",
          clientMessage: "Book information and reading information are required",
        }},
        { status: 404 }
      );
    }

    const bookData: Book = JSON.parse(book);
    const userData: UserInfo = JSON.parse(userInfo);

    // TODO: do xata pull main to get new table
    const getCreateBook = await xata.db.CreatedBooks.filter({
      user: userInfo.email,
      isbn: userInfo.isbn,
      bookImage: userInfo.bookImage,
    }).getFirst();
      
    const createBook = await xata.db.CreatedBooks.createOrUpdate(getCreateBook?, {
      // TODO: and other stuff...
    });
    
  }
  catch (error) {
    return NextResponse.json(
      { 
        message: { 
          developerMessage: "CreateBook: Internal Server Error",
          clientMessage: "There was an error. Please try again.",
        }
      }, 
      { status: 500},
    );
  }
}
