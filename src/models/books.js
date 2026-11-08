import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find({}).toArray();
    return books;
};

const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    const book = await collection.findOne({ id: bookId });
    return book;
};

const createBook = async ( newBook) => {
    
    const db = getDb();
    const collection = db.collection('books')
    const author = await collection.insertOne(newBook);
    return author

}

const isBookTitleExist = async (bookTitle) => {
    const db = getDb();
    const collection = db.collection('books')
    const result = await collection.findOne({ name: bookTitle})
    return result

}

const isBookIdExist = async (booksId) => {
    const db = getDb();
    const collection = db.collection('books')
    const result = await collection.findOne({ id: booksId})
    return result

}

const updateBook = async (bookId, updatedBookData) => {
    const db = getDb();
    const collection = db.collection('books')
    const result = await collection.updateOne(
        { id : bookId},
        { $set: updatedBookData}
    )

    if (result.matchedCount === 0) {
        return null
    }

    return result
}

const deleteBook = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books')
    const result = await collection.deleteOne(
        { id : bookId}
    )

    if (result.deletedCount === 0) {
        return null
    }

    return result

}
export { getAllBooks, getBookById, createBook, isBookTitleExist, isBookIdExist, updateBook, deleteBook };