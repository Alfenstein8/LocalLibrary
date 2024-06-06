const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const Genre = require("../models/genre");
const { Genre: Genre_sql } = require("../models/genre_sql");
const { Book: Book_sql } = require("../models/book_sql");
const asyncHandler = require("express-async-handler");

const { config } = require("../db");
// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  let allGenres;
  if (config.usingSQL) {
    allGenres = await Genre_sql.findAll();
  } else {
    allGenres = await Genre.find().sort({ name: 1 }).exec();
  }
  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres,
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  let genre, booksInGenre;
  if (config.usingSQL) {
    [genre, booksInGenre] = await Promise.all([
      Genre_sql.findByPk(req.params.id),
      Book_sql.findAll({ where: { genre: req.params.id } }),
    ]);
  } else {
    [genre, booksInGenre] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Book.find({ genre: req.params.id }, "title summary").exec(),
    ]);
  }
  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    let genre;
    if (config.usingSQL) {
      genre = Genre_sql.build({ name: req.body.name });
    } else {
      genre = new Genre({ name: req.body.name });
    }
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      let genreExists;
      if (config.usingSQL) {
        genreExists = await Genre_sql.findOne({
          where: { name: req.body.name },
        });
      } else {
        genreExists = await Genre.findOne({ name: req.body.name }).exec();
      }

      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allBooksWithGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    // No results.
    res.redirect("/catalog/genres");
  }

  res.render("genre_delete", {
    title: "Delete genre",
    genre: genre,
    books_with_genre: allBooksWithGenre,
  });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allBooksWithGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksWithGenre.length > 0) {
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      genre_with_genre: allBooksWithGenre,
    });
    return;
  } else {
    // Author has no books. Delete object and redirect to the list of authors.
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genres");
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form", {
    title: "Update Genre",
    genre: genre,
  });
});

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name, _id: req.params.id });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        // Data from form is valid. Update the record.
        const updatedGenre = await Genre.findByIdAndUpdate(
          req.params.id,
          genre,
          {}
        );
        // Redirect to book detail page.
        res.redirect(updatedGenre.url);
      }
    }
  }),
];
