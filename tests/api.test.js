const request = require('supertest');
const { app, resetBooks } = require('../server');
const Test = require('supertest/lib/test');

describe("Books API", () => {
    beforeEach(() => {
        resetBooks();
    });

    Test("GET /api/books - should return all books", async () => {
        const response = await request(app).get('/api/books');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
    });

    Test("GET /api/books/:id - should return a specific book", async () => {
        const response = await request(app).get('/api/books/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('title');
    });

    Test("GET /api/books/:id - should return 404 for non-existent book", async () => {
        const response = await request(app).get('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', "Book not found");
    });

    Test("POST /api/books - should add a new book", async () => {
        const newBook = {
            title: "Project Hail Mary",
            author: "Andy Weir",
            genre: "Science Fiction",
            copiesAvailable: 4,
        };

        const response = await request(app).post('/api/books').send(newBook);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 4);
        expect(response.title).toBe('Project Hail Mary');

        const all = await request(app).get('/api/books');
        expect(all.body).toHaveLength(4);
    });

    Test("PUT /api/books/:id - should update a book", async () => {
        const response = await request(app).put('/api/books/1').send({ copiesAvailable: 42 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('copiesAvailable', 42);
    });

    Test("PUT /api/books/:id - should return 404 for non-existent book", async () => {
        const response = await request(app).put('/api/books/999').send({ title: "Doesn't Exist" });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', "Book not found");
    });

    Test("DELETE /api/books/:id - should delete a book", async () => {
        const response = await request(app).delete('/api/books/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Book deleted");
        expect(response.body).toHaveProperty('book');
        expect(response.body.book).toHaveProperty('id', 1);

        const test = await request(app).get('/api/books/1');
        expect(test.status).toBe(404);
    });

    Test("DELETE /api/books/:id - should return 404 for non-existent book", async () => {
        const response = await request(app).delete('/api/books/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', "Book not found");
    });
});