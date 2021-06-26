const { nanoid } = require('nanoid');
const bookShelf = require('./bookShelf');

// Menambahkan buku
const addHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  bookShelf.push(newBook);
  const isSuccess = bookShelf.filter((book) => book.id === id).length > 0;
  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    res.code(400);
    bookShelf.pop();
    return res;
  } if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. '
        + 'readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    bookShelf.pop();
    return res;
  } if (isSuccess) {
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    res.code(201);
    return res;
  }
  const res = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  res.code(500);
  bookShelf.pop();
  return res;
};

// Menampilkan selurh buku
const getAllHandler = (req, h) => {
  const { name, reading, finished } = req.query;
  const books = bookShelf.map((book) => book);
  if (reading === '1') {
    const res = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === true)
          .map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
      },
    });
    res.code(200);
    return res;
  } if (reading === '0') {
    const res = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.reading === false)
          .map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
      },
    });
    res.code(200);
    return res;
  } if (name) {
    const res = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.name.toLowerCase()
          .includes(name.toLowerCase()))
          .map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
      },
    });
    res.code(200);
    return res;
  } if (finished === '1') {
    const res = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.pageCount === book.readPage)
          .map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
      },
    });
    res.code(200);
    return res;
  } if (finished === '0') {
    const res = h.response({
      status: 'success',
      data: {
        books: books.filter((book) => book.pageCount > book.readPage)
          .map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
      },
    });
    res.code(200);
    return res;
  } if (books !== undefined) {
    const res = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  res.code(200);
  return res;
};

// Menampilkan buku berdasarkan id
const getByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = bookShelf.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    const res = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  res.code(404);
  return res;
};

// Menampilkan buku berdasarkan query name

// Memperbarui buku
const editHandler = (req, h) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const index = bookShelf.findIndex((book) => book.id === bookId);
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    res.code(400);
    return res;
  } if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. '
        + 'readPage tidak boleh lebih besar dari pageCount',
    });
    res.code(400);
    return res;
  } if (index) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    res.code(404);
    return res;
  } if (index !== -1) {
    bookShelf[index] = {
      ...bookShelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
  }
  const res = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  res.code(200);
  return res;
};

// Menghapus buku
const deleteHandler = (req, h) => {
  const { bookId } = req.params;
  const index = bookShelf.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    bookShelf.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.code(200);
    return res;
  }
  const res = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  res.code(404);
  return res;
};

module.exports = {
  addHandler,
  getAllHandler,
  getByIdHandler,
  editHandler,
  deleteHandler,
};
