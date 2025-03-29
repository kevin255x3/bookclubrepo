// book model - handles db operations for books tables
const db = require('../config/db');

class Book {

    // get all books with optional filters
    // filters - optional category and search filters
    static async getAll(filters = {}) {
        try {
            let query = `
        SELECT b.*, c.name as category_name 
        FROM books b
        LEFT JOIN categories c ON b.category_id = c.id
        WHERE 1=1
      `;

            const queryParams = [];

            // add category filter if provided
            if (filters.categoryId) {
                query += ` AND b.category_id = ?`;
                queryParams.push(filters.categoryId);
            }

            // add search filter if provided
            if (filters.search) {
                query += ` AND (b.title LIKE ? OR b.author LIKE ?)`;
                queryParams.push(`%${filters.search}%`, `%${filters.search}%`);
            }

            query += ` ORDER BY b.created_at DESC`;

            const [rows] = await db.execute(query, queryParams);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // get single book by id
    // id - book id
    static async getById(id) {
        try {
            const [rows] = await db.execute(
                `SELECT b.*, c.name as category_name 
         FROM books b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.id = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
    // create a new book
    // bookData - book information
    static async create(bookData) {
        try {
            const { title, author, description, publication_year, cover_image, category_id } = bookData;

            const [result] = await db.execute(
                `INSERT INTO books (title, author, description, publication_year, cover_image, category_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [title, author, description, publication_year, cover_image, category_id]
            );

            const id = result.insertId;
            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // update a book
    // id - book id
    // bookData - updated book information
    static async update(id, bookData) {
        // add dynamic query bulding (only changed fields)
        try {
            const { title, author, description, publication_year, cover_image, category_id } = bookData;

            let query = `UPDATE books SET updated_at = NOW()`;
            const queryParams = [];

            // only update fields that are provided
            if (title !== undefined) {
                query += `, title = ?`;
                queryParams.push(title);
            }

            if (author !== undefined) {
                query += `, author = ?`;
                queryParams.push(author);
            }

            if (description !== undefined) {
                query += `, description = ?`;
                queryParams.push(description);
            }

            if (publication_year !== undefined) {
                query += `, publication_year = ?`;
                queryParams.push(publication_year);
            }

            if (cover_image !== undefined) {
                query += `, cover_image = ?`;
                queryParams.push(cover_image);
            }

            if (category_id !== undefined) {
                query += `, category_id = ?`;
                queryParams.push(category_id);
            }

            query += ` WHERE id = ?`;
            queryParams.push(id);

            await db.execute(query, queryParams);
            return this.getById(id);
        } catch (error) {
            throw error;
        }
    }

    // delete a book
    // id - book id
    static async delete(id) {
        try {
            const [result] = await db.execute(
                `DELETE FROM books WHERE id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Book;