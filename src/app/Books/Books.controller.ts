import { Request ,Response } from "express";
import { BooksServices } from "./Books.service";
// import { BookValidator } from "./Books.validatio";

// create 
const createBooks = async (req:Request, res:Response) =>{
    try{
        // receiving data from frontend
const Books =req.body
/* zod validation 

const ZoeValidation = BookValidator.parse(Books);
const result =await BooksServices.createBooksTooDB(ZoeValidation)

*/

// sending  Bookss to  services without z validatoin
const result =await BooksServices.createBooksTooDB(Books)
    

res.status(200).json({
            success: true,
            message: 'Books added successfully',
            data: result 
          });

    }catch(err){
        // error in sending data 

        res.status(500).json({
            success: false,
            message: 'something went wrong',
            data: err,
          });

    }
}


// Get
const getAllBooks = async (req: Request, res: Response) => {
    try {
      const result = await BooksServices.getAllbooks();
      res.status(200).json({
        success: true,
        message: 'Books retrieved successfully',
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'something went wrong',
        data: err,
      });
    }
  };



export const BooksControllers = {
 createBooks,
 getAllBooks
  };
  