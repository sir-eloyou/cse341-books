import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors');
    const author = await collection.findOne({ id: authorId });
    return author;
};

const createAuthor = async ( newAuthor) => {
    
    const db = getDb();
    const collection = db.collection('authors')
    const author = await collection.insertOne(newAuthor);
    return author

}

const isAuthorNameExist = async (authorName) => {
    const db = getDb();
    const collection = db.collection('authors')
    const isAuthorNameExist = await collection.findOne({ name: authorName})
    return isAuthorNameExist

}

const isAuthorIdExist = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors')
    const isAuthorIdExist = await collection.findOne({ id: authorId})
    return isAuthorIdExist

}

const updateAuthor = async (authorId, updatedAuthorData) => {
    const db = getDb();
    const collection = db.collection('authors')
    const result = await collection.updateOne(
        { id : authorId},
        { $set: updatedAuthorData}
    )

    if (result.matchedCount === 0) {
        return null
    }

    return result
}

const deleteAuthor = async (authorId) => {
    const db = getDb();
    const collection = db.collection('authors')
    const result = await collection.deleteOne(
        { id : authorId}
    )

    if (result.deletedCount === 0) {
        return null
    }

    return result

}
export { getAllAuthors, getAuthorById, isAuthorNameExist, isAuthorIdExist, createAuthor, updateAuthor, deleteAuthor};