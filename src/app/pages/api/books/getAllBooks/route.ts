import { xata } from "@/app/pages/utils/xata";
import { Book } from "@/app/types/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { readingProgress, userEmail, batchSize } = await request.json();

    if (!readingProgress || !userEmail || !batchSize) {
      return NextResponse.json(
        {
          message: {
            developerMessage:
              "getAllBooks: readingProgress, userEmail, and batchSize is required",
            clientMessage: `Could not get all the books from your ${readingProgress} list. Please try again.`,
          },
        },
        { status: 404 },
      );
    }

    // GET THE FIRST X BATCH SIZE OF BOOKS
    let getAllBooks = await xata.db.Books.filter({
      user: userEmail,
      readingProgress: readingProgress,
    })
      .sort("xata_updatedat", "desc")
      .getMany({ pagination: { size: Number(batchSize) } });

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

    // TURN THE DATA FROM XATA INTO A BOOK TYPE
    const booksList: Book[] = getAllBooks.map((item) => {
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

    // IF THERE ARE MORE BOOKS TO BE GOTTEN, GET THE NEXT X BATCH SIZE, UNTIL ALL BOOKS ARE FETCHED
    while (getAllBooks.hasNextPage()) {
      await new Promise((res) => setTimeout(res, 200)); // wait 0.2 seconds
      
      getAllBooks = await getAllBooks.nextPage();

      const newList: Book[] = getAllBooks.map((item) => {
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
          categories:
            item.categories != undefined ? item.categories : undefined,
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

      booksList.push(...newList); // ADD TO CURRENT LIST
    }

    return NextResponse.json(
      {
        message: {
          developerMessage: "getAllBooks: Success",
          clientMessage: "Success!",
          getAllBooks: JSON.stringify(booksList),
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
