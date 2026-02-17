const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
    // Add more books if you'd like!
];

/* Create your REST API here with the following endpoints:
    'GET /api/books': 'Get all books',
    'GET /api/books/:id': 'Get a specific book',
    'POST /api/books': 'Add a new book',
    'PUT /api/books/:id': 'Update a book',
    'DELETE /api/books/:id': 'Delete a book'
*/

function resetBooks() {
    books = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "Fiction",
            copiesAvailable: 5
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            genre: "Fiction",
            copiesAvailable: 3
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            genre: "Dystopian Fiction",
            copiesAvailable: 7
        }
    ];
}

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Bookstore API!" ,
        endpoints: {
            'GET /api/books': "Get all books",
            'GET /api/books/:id': "Get a specific book by ID",
            'POST /api/books': "Add a new book",
            'PUT /api/books/:id': "Update a book",
            'DELETE /api/books/:id': "Delete a book"
        },
    });
});

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const book = books.find(b => b.id === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

app.post('/api/books', (req, res) => {
    const { title, author, genre, copiesAvailable } = req.body;
    const newBook = {
        id: books.length + 1,
        title,
        author,
        genre,
        copiesAvailable
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === bookId);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    if (req.body.title !== undefined) book.title = req.body.title;
    if (req.body.author !== undefined) book.author = req.body.author;
    if (req.body.genre !== undefined) book.genre = req.body.genre;
    if (req.body.copiesAvailable !== undefined) book.copiesAvailable = req.body.copiesAvailable;

    res.json(book);
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10);
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json({ message: "Book deleted successfully", book: deletedBook });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`API Server is running on http://localhost:${port}`);
    });
}

module.exports = app;