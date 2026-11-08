import { isAuthorIdExist } from '../models/authors.js';
import { 
    getAllBooks, 
    getBookById,
    createBook,
    isBookTitleExist,
    isBookIdExist,
    updateBook,
    deleteBook
} from '../models/books.js';

const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('GET /books failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getBookByIdHandler = async (req, res) => {
    const requestedId = req.params.id;

    try {
        const book = await getBookById(requestedId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('GET /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createBookHandler = async (req, res) => {
    const { id, authorId, title, publicationDate } = req.body;

    try {

        if (!id || !authorId || !title || !publicationDate ) {
            return res.status(400).json({ message : "id, authorId, title and publication date are required"})
        }

    

        const existingBookTitle = await isBookTitleExist(title)
        if (existingBookTitle) {
            return res.status(400).json({ message : "Book's title already existed"})
        }

        const existingBookId = await isBookIdExist(id)
        if (existingBookId) {
            return res.status(400).json({ message : `Book's Id (${id}) already existed`})
        }

        const existingAuthorId = await isAuthorIdExist(authorId)
        if (!existingAuthorId) {
            return res.status(400).json({ message : `Author's Id (${authorId}) not existed`})
        }

        const book = { id, authorId, title, publicationDate }
        await createBook(book)

        return res.status(201).json(book);


    } catch (error) {
        console.error('POST /books failed:', error.message);
        return res.status(500).json({ message: 'Unable to create new book' });

    }
}

const updateBookHandler = async (req, res) => {
    const id = req.params.id;
    const { authorId, title,  publicationDate } = req.body;

    try {

        if (!authorId || !title || !publicationDate ) {
            return res.status(400).json({ message : "author's ID, title, and Publication date are required"})
        }

        const existingAuthorId = await isAuthorIdExist(authorId)
        if (!existingAuthorId) {
            return res.status(400).json({ message : `Author's Id (${authorId}) not existed`})
        }


        const newUpdatedBook = { id, authorId, title, publicationDate }
        const result = await updateBook(id, newUpdatedBook)

        if (!result) {
            return res.status(404).json({ message: `Book with id '${id}' not found` });
        }
        return res.status(200).json({
            message: "Successfully updated",
            result: newUpdatedBook
        });

    } catch (error) {
        console.error('PUT /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to update the book' });
    }


}

const deleteBookHandler = async (req, res) => {
    const id = req.params.id;

    try {

        if (!id) {
            return res.status(400).json({
                message: 'Book ID is required'
            });
        }


        const result = await deleteBook(id)

        if (!result) {
            return res.status(404).json({
                message: `Book with ID ${id} not found`
            });
        }

        return res.status(200).json({
            message : 'Book successfully deleted'
        })


    } catch (error) {

        console.error('DELETE /books/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to delete the book' });
    }
}
export { getBooksHandler, getBookByIdHandler, createBookHandler, updateBookHandler, deleteBookHandler };