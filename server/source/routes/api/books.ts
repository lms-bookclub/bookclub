import * as express from 'express';
import * as mongoLayers from 'utils/mongo-layers';
import { setReqDate, requireAuthentication, requireSelfOrAdmin } from 'middleware';
import { BookModel } from 'schemas/book';
const routes = express.Router();

routes.get('/', mongoLayers.findAll(BookModel));
// routes.get('/', (req, res, next) => {
//   setTimeout(() => next(), 1000);
// }, mongoLayers.findAll(BookModel));
routes.get('/:_id', mongoLayers.findOne(BookModel));
routes.post('/',
  setReqDate('created'),
  mongoLayers.createOne(BookModel)
);
routes.patch('/:_id',
  requireAuthentication,
  requireSelfOrAdmin(req => req.body.suggestedBy || req.user._id),
  mongoLayers.patchOne(BookModel)
);
routes.put('/:_id',
  requireAuthentication,
  requireSelfOrAdmin(req => req.body.suggestedBy || req.user._id),
  mongoLayers.putOne(BookModel)
);
routes.delete('/:_id',
  requireAuthentication,
  requireSelfOrAdmin(req => req.body.suggestedBy || req.user._id),
  async (req, res, next) => {
    const book = await BookModel.findById(req.params._id);

    if (book) {
      if (book.status === 'BACKLOG' || book.status === 'SUGGESTED') {
        next();
      } else {
        res.status(403).send('Cannot only delete books that are in backlog or proposed');
      }
    } else {
      next();
    }
  },
  mongoLayers.deleteOne(BookModel)
);

module.exports = routes;
export {}