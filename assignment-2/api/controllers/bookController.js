// handles http requests for books
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // stores in uploads directory (folder)
    },
    filename: (req, file, cb) => {
        // create a unique filename (no repeats) with original ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// filter only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .jpg and .png files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    }
});

// methods
const bookController = {
    // get all books with optional filtering
    getAllBooks: async (req, res) => {
        try {
            const { categoryId, search } = req.query;
            const filters = {};

            if (categoryId) filters.categoryId = categoryId;
            if (search) filters.search = search;

            const books = await Book.getAll(filters);
            res.status(200).json(books);
        } catch (error) {
            console.error('Error getting books:', error);
            res.status(500).json({ message: 'Error retrieving books', error: error.message });
        }
    },

    // get a single book by ID
    getBookById: async (req, res) => {
        try {
            const id = req.params.id;
            const book = await Book.getById(id);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.status(200).json(book);
        } catch (error) {
            console.error('Error getting book:', error);
            res.status(500).json({ message: 'Error retrieving book', error: error.message });
        }
    },

    // middleware for file upload
    // only allows image files
    // book cover
    uploadMiddleware: upload.single('cover_image'),

    // create a new book
    createBook: async (req, res) => {
        try {
            // create book data obj from req
            const bookData = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                publication_year: req.body.publication_year,
                category_id: req.body.category_id,
                cover_image: req.file ? req.file.filename : null // use uploaded file name
            };

            const newBook = await Book.create(bookData);
            res.status(201).json(newBook);
        } catch (error) {
            // clean up uploaded file on error
            console.error('Error creating book:', error);


            if (req.file) {
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }

            res.status(500).json({ message: 'Error creating book', error: error.message });
        }
    },

    // update an existing book
    updateBook: async (req, res) => {
        try {
            const id = req.params.id;
            const existingBook = await Book.getById(id);

            if (!existingBook) {
                // delete file is book not found
                if (req.file) {
                    fs.unlink(req.file.path, (unlinkError) => {
                        if (unlinkError) console.error('Error deleting file:', unlinkError);
                    });
                }

                return res.status(404).json({ message: 'Book not found' });
            }

            const bookData = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                publication_year: req.body.publication_year,
                category_id: req.body.category_id
            };

            // only update cover_image if a new file was uploaded
            if (req.file) {
                bookData.cover_image = req.file.filename;

                // delete old cover image if it exists
                if (existingBook.cover_image) {
                    const oldImagePath = path.join(__dirname, '../uploads/', existingBook.cover_image);
                    fs.unlink(oldImagePath, (unlinkError) => {
                        if (unlinkError) console.error('Error deleting old image:', unlinkError);
                    });
                }
            }

            const updatedBook = await Book.update(id, bookData);
            res.status(200).json(updatedBook);
        } catch (error) {
            console.error('Error updating book:', error);

            // if there was a file upload, delete it on error
            if (req.file) {
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }

            res.status(500).json({ message: 'Error updating book', error: error.message });
        }
    },

    // delete a book
    deleteBook: async (req, res) => {
        try {
            const id = req.params.id;
            const existingBook = await Book.getById(id);

            if (!existingBook) {
                return res.status(404).json({ message: 'Book not found' });
            }

            // delete the cover image if it exists
            if (existingBook.cover_image) {
                const imagePath = path.join(__dirname, '../uploads/', existingBook.cover_image);
                fs.unlink(imagePath, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting image:', unlinkError);
                });
            }

            const deleted = await Book.delete(id);

            if (deleted) {
                res.status(200).json({ message: 'Book deleted successfully' });
            } else {
                res.status(500).json({ message: 'Error deleting book' });
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({ message: 'Error deleting book', error: error.message });
        }
    }
};

module.exports = bookController;