import { xata } from "@/app/pages/utils/xata";
import { Book } from "@/app/types/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { readingProgress, userEmail } = await request.json();

    if (!readingProgress || !userEmail) {
      return NextResponse.json(
        {
          message: {
            developerMessage:
              "getAllBooks: readingProgress and userEmail is required",
            clientMessage: `Could not get all the books from your ${readingProgress} list. Please try again.`,
          },
        },
        { status: 404 },
      );
    }

    const getAllBooks = await xata.db.Books.filter({
      user: userEmail,
      readingProgress: readingProgress,
    }).sort("xata_createdat", "desc").getAll();

    if (!getAllBooks) {
      return NextResponse.json(
        {
          message: {
            developerMessage: `getAllBooks: Could not get all books from ${readingProgress}`,
            clientMessage: `There was an error. Please try again.`,
            getAllBooks: null,
          },
        },
        { status: 200 },
      );
    }

    // TURN THE BOOKS FORM XATA INTO A BOOK TYPE
    const list: Book[] = getAllBooks.map((item) => {
      return {
        googleBookId:
          item.googleBookId != undefined ? item.googleBookId : undefined,
        title: item.title != undefined ? item.title : undefined,
        subtitle: item.subtitle != undefined ? item.subtitle : undefined,
        authors: item.authors != undefined ? item.authors : undefined,
        publisher: item.publisher != undefined ? item.publisher : undefined,
        description:
          item.description != undefined ? item.description : undefined,
        industryIdentifiers: [
          {
            type: item.isbnType ?? "",
            identifier: item.isbn ?? "",
          },
        ],
        pageCount: Number(item.pageCount),
        categories: item.categories != undefined ? item.categories : undefined,
        imageLinks: {
          smallThumbnail:
            item.bookImage != undefined ? item.bookImage[0] : undefined,
          thumbnail:
            item.bookImage != undefined ? item.bookImage[1] : undefined,
        },
        userInfo: {
          readingProgress:
            item.readingProgress != undefined
              ? item.readingProgress
              : undefined,
          readingFormat:
            item.readingFormat != undefined ? item.readingFormat : undefined,
          startDate: item.startDate?.toLocaleDateString(),
          endDate: item.endDate?.toLocaleDateString(),
          rating: item.rating != undefined ? item.rating : undefined,
          comments: item.comments != undefined ? item.comments : undefined,
          userEmail: userEmail,
          googleBook: item.googleBook,
          xata_createdat: item.xata_createdat.toLocaleDateString(),
          xata_id: item.xata_id,
          xata_updatedat: item.xata_updatedat.toLocaleDateString(),
          xata_version: item.xata_version,
        },
      } as Book;
    });


    return NextResponse.json(
      {
        message: {
          developerMessage: "getAllBooks: Success",
          clientMessage: "Success!",
          getAllBooks: JSON.stringify(list),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
