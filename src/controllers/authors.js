import { 
    getAllAuthors as getAllAuthorsFromDb, 
    getAuthorById as getAuthorByIdFromDb, 
    createAuthor as createAuthorIntoDb, 
    isAuthorNameExist as isAuthorNameExistFromDb,
    isAuthorIdExist as isAuthorIdExistFromDb,
    updateAuthor as updateAuthorFromDb,
    deleteAuthor as deleteAuthorFromDb

} from '../models/authors.js';
import formatTitleCase from './utils.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {

    const requestedId = req.params.id;

    try {

        const author = await getAuthorByIdFromDb(requestedId)

        if (!author) {
            return res.status(404).json({ message: "No author exists with that id"})
        }

        return res.status(200).json(author)

    } catch (error) {
        console.error('GET /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const createAuthor = async (req, res) => {
    const { id, name, birthYear } = req.body;

    try {

        if (!id || !name || birthYear === undefined ) {
            return res.status(400).json({ message : "id, name, and birthYear are required"})
        }

        if (typeof birthYear !== 'number' || !Number.isInteger(birthYear)) {
            return res.status(400).json({ 
                message: 'birthYear must be a valid integer' 
            });
        }

        const formattedName = formatTitleCase(name)

        const existingAuthorName = await isAuthorNameExistFromDb(formattedName)
        if (existingAuthorName) {
            return res.status(400).json({ message : "Author's name already existed"})
        }

        const existingAuthorId = await isAuthorIdExistFromDb(id)
        if (existingAuthorId) {
            return res.status(400).json({ message : `Author's Id (${id}) already existed`})
        }

        const newAuthor = { id, name: formattedName, birthYear }
        await createAuthorIntoDb(newAuthor)

        return res.status(201).json(newAuthor);


    } catch (error) {
        console.error('POST /authors failed:', error.message);
        return res.status(500).json({ message: 'Unable to create new author' });

    }
}

const updateAuthor = async (req, res) => {
    const authorId = req.params.id;
    const { name, birthYear } = req.body;

    try {

        if (!authorId || !name || birthYear === undefined ) {
            return res.status(400).json({ message : "id, name, and birthYear are required"})
        }

        if (typeof birthYear !== 'number' || !Number.isInteger(birthYear)) {
            return res.status(400).json({ 
                message: 'birthYear must be a valid integer' 
            });
        }

        const formattedName = formatTitleCase(name)

        const newUpdatedAuthor = { id: authorId, name: formattedName, birthYear }
        const result = await updateAuthorFromDb(authorId, newUpdatedAuthor)

        if (!result) {
            return res.status(404).json({ message: `Author with id '${authorId}' not found` });
        }
        return res.status(200).json({
            message: "Successfully updated",
            result: newUpdatedAuthor
        });

    } catch (error) {
        console.error('PUT /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to update the author' });
    }


}

const deleteAuthor = async (req, res) => {
    const authorId = req.params.id;

    try {

        if (!authorId) {
            return res.status(400).json({
                message: 'Author ID is required'
            });
        }


        const result = await deleteAuthorFromDb(authorId)

        if (!result) {
            return res.status(404).json({
                message: `Author with ID ${authorId} not found`
            });
        }

        return res.status(200).json({
            message : 'Author successfully deleted'
        })


    } catch (error) {

        console.error('DELETE /authors/:id failed:', error.message);
        return res.status(500).json({ message: 'Unable to delete the author' });
    }
}

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };