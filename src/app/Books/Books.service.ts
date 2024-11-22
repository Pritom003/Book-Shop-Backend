import { TBooks } from "./Books.interface";
import BooksModel from "./Books.models";


const createBooksTooDB = async (Books :TBooks) => {
    const result = await BooksModel.create(Books);
    return result;
  };

const getAllbooks = async () => {
    const result = await BooksModel.find();
    return result;
  };
  export const BooksServices = {
    createBooksTooDB,
    getAllbooks
  };