function findAll(Model) {
  return (req, res) => {
    const fields = req.query.fields ? req.query.fields.split(',') : ['*'];

    const findObject = Object
      .keys(req.query)
      .filter(_ => _ !== 'fields')
      .reduce((queries, key) => {
        queries[key] = {
          $in: req.query[key].split(','),
        };
        return queries;
      }, {});

    let query = Model.find(findObject);

    if(!(fields.length === 1 && fields[0] === '*')) {
      query = query.select(`_id ${fields.join(' ')}`)
    }

    query
      .exec((err, entries) => {
        if(err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(entries);
        }
      })
  }
}
function findOne(Model, idParam = '_id') {
  return (req, res) => {
    Model.findById(req.params[idParam])
      .then(entry => {
        res.status(entry ? 200 : 404).json(entry);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
}

function createOne(Model) {
  return (req, res) => {
    Model.create(req.body)
      .then(entry => {
        res.status(201).json(entry);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
}

function patchOne(Model, idParam = '_id', path = null) {
  return (req, res) => {
    const body = path ? { [path]: req.body, } : req.body;
    Model.updateOne({ _id: req.params[idParam] }, body)
      .then(transaction => {
        res.header('Transaction', JSON.stringify(transaction));
        return Model.findById({ _id: req.params[idParam] });
      })
      .then(entry => {
        res.status(200).json(entry);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
}

function putOne(Model, idParam = '_id', path = null) {
  return (req, res) => {
    const body = path ? { [path]: req.body, } : req.body;
    Model.replaceOne({ _id: req.params[idParam] }, body)
      .then(entry => {
        res.status(200).json(entry);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
}

function deleteOne(Model, idParam = '_id') {
  return (req, res) => {
    Model.deleteOne({ _id: req.params[idParam] })
      .then(entry => {
        res.status(204).send();
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
}

export {
  findAll,
  findOne,
  createOne,
  patchOne,
  putOne,
  deleteOne,
};