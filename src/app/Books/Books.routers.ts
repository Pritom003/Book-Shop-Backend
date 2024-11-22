import express from 'express';
import { BooksControllers } from './Books.controller';

const Booksrouter = express.Router();
// call the controller
Booksrouter.post('/add-books', BooksControllers.createBooks );
Booksrouter.get('/', BooksControllers.getAllBooks);

export default Booksrouter;