const asyncHandler = require("express-async-handler");
const Author = require("../models/author");
const Book = require("../models/book");
const Genre = require("../models/genre");

exports.search_page = asyncHandler(async (req, res, next) => {
  const query = req.query.q;
  const searchResults = { authors: [], books: [], genres: [] };
  if (query) {
    [searchResults.authors, searchResults.books, searchResults.genres] =
      await Promise.all([
        await Author.fuzzySearch(query).exec(),
        await Book.fuzzySearch(query).exec(),
        await Genre.fuzzySearch(query).exec(),
      ]);
  }
  res.render("search_page", { title: "Search", searchResults: searchResults });
});

exports.indexDocuments = asyncHandler(async (req, res, next) => {
  res.send("Not implemented indexing");
});
