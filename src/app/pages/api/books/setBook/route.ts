import { xata } from "@/app/pages/utils/xata";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { book, userInfo } = await request.json();

    if (!book || !userInfo) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "setBook: Book and userInfo are required",
            clientMessage:
              "There was an error viewing your book. Please try again.",
            messageType: "bad",
          },
        },
        { status: 404 },
      );
    }

    // MATCHES userEmail AND [googleBookID OR (isbnTYP AND isbn)]
    const getBook = await xata.db.Books.filter({
      user: userInfo.userEmail,
      $any: [
        {
          isbnType: {
            $any: [
              book.industryIdentifiers
                ?.map((item: { type: string }) => item.type)
                .join(),
            ],
          },
          isbn: {
            $any: [
              book.industryIdentifiers
                ?.map((item: { identifier: string }) => item.identifier)
                .join(),
            ],
          },
        },
        { googleBookId: book.googleBookId },
      ],
    }).getFirst();

    // THE BOOK IS NOT A GOOGLE BOOK -- UPDATE EVERYTHING
    const setBook = await xata.db.Books.createOrReplace(getBook?.xata_id, {
      googleBookId: book.googleBookId,
      title: book.title,
      subtitle: book.subtitle,
      description: book.description,
      isbnType:
        book.industryIdentifiers.find(
          (item: { type: string }) => item.type === "ISBN_13",
        )?.type ??
        book.industryIdentifiers.find(
          (item: { type: string }) => item.type === "ISBN_10",
        )?.type ??
        "",
      isbn:
        book.industryIdentifiers.find(
          (item: { type: string; identifier: string }) =>
            item.type === "ISBN_13",
        )?.identifier ??
        book.industryIdentifiers.find(
          (item: { type: string; identifier: string }) =>
            item.type === "ISBN_10",
        )?.identifier ??
        "",
      authors: book.authors,
      bookImage: [book.imageLinks.smallThumbnail, book.imageLinks.thumbnail],
      categories: book.categories,
      pageCount: book.pageCount,
      publishedDate: book.publishedDate ? new Date(book.publishedDate) : null,

      readingProgress: userInfo.readingProgress,
      readingFormat: userInfo.readingFormat,
      startDate: userInfo.startDate ? new Date(userInfo.startDate) : null,
      endDate: userInfo.endDate ? new Date(userInfo.endDate) : null,
      rating: userInfo.rating,
      comments: userInfo.comments,
      user: userInfo.userEmail,
      googleBook: userInfo.googleBook,
    });

    if (!setBook) {
      return NextResponse.json(
        {
          message: {
            developerMessage: "setBook: Could not create or update book",
            clientMessage: "The book could not be saved. Please try again",
            messageType: "bad",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "setBook: Success",
          clientMessage: "Book successfully saved.",
          messageType: "good",
          xataData: JSON.stringify({
            xata_createdat: setBook.xata_createdat,
            xata_id: setBook.xata_id,
            xata_updatedat: setBook.xata_updatedat,
            xata_version: setBook.xata_version,
          }),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("setBook Error", error);
    return NextResponse.json(
      {
        message: {
          developerMessage: "Internal server error.",
          clientMessage: "There was an error. Please try again.",
          messageType: "bad",
        },
      },
      { status: 500 },
    );
  }
}
