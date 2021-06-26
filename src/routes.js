const {
  addHandler,
  getAllHandler,
  getByIdHandler,
  editHandler,
  deleteHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteHandler,
  },
];

module.exports = routes;
