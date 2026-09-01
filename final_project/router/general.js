const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. You can now login" });
});


public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books, null, 4));
});


public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Go somewhere else!" });
    }
});
  

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];

    bookKeys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push({
                isbn: key,
                title: books[key].title,
                reviews: books[key].reviews
            });
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});


public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
    const matchingBooks = [];

    const keys = Object.keys(books);

    keys.forEach((isbn) => {
        let book = books[isbn];
        
        if (book.title.toLowerCase() === requestedTitle.toLowerCase()) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No book found with this title" });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
