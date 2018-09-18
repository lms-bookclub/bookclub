import * as express from 'express';
import * as mongoLayers from 'utils/mongo-layers';
import { requireAuthentication, requireAdmin, setReqDate } from 'middleware';
import { UserModel } from 'schemas/user';
const routes = express.Router();

routes.get('/me', (req, res) => {
  if(req.user) {
    res.json(req.user);
  } else {
    res.send(404);
  }
});

routes.get('/', mongoLayers.findAll(UserModel));
routes.get('/:_id', mongoLayers.findOne(UserModel));
routes.post('/',
  setReqDate('created'),
  mongoLayers.createOne(UserModel)
);
routes.patch('/:_id',
  requireAuthentication,
  requireAdmin,
  mongoLayers.patchOne(UserModel)
);
routes.put('/:_id',
  requireAuthentication,
  requireAdmin,
  mongoLayers.putOne(UserModel)
);
routes.delete('/:_id',
  requireAuthentication,
  requireAdmin,
  mongoLayers.deleteOne(UserModel)
);

module.exports = routes;
export {}