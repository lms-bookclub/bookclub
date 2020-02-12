import * as express from 'express';
const routes = express.Router();
import { requireAuthentication, requireAdmin, setReqDate } from 'middleware/index';
import bookscraps from 'services/bookscraps';
import { BookModel } from 'schemas/book';
import { SeasonModel } from 'schemas/season';
import { VotingSessionModel } from 'schemas/voting-session';

routes.post('/start-new-season',
  requireAuthentication,
  requireAdmin,
  async (req, res, next) => {
    const openSeason = await SeasonModel.getOpenSeason();

    if(!openSeason) {
      next();
    } else {
      res.status(403).send('Cannot start a season while one is currently ongoing.');
    }
  },
  setReqDate('created'),
  async (req, res) => {
    try {
      const now = req.body.dates.created;
      const votingSessionBody = Object.assign({}, req.body.votingSession || {});
      if (req.body.votingSession) {
        delete req.body.votingSession;
      }
      const entry = await SeasonModel.create(req.body);

      await VotingSessionModel.update({
        "dates.finished": {
          $exists: false,
        },
      }, {
        $set: { 'dates.finished': now }
      }, {
        multi: true,
      });

      entry.votingSession = await VotingSessionModel.create({
        ...votingSessionBody,
        'dates.created': now,
        'dates.started': now,
      });

      await entry.save();

      res.status(201).json(entry);
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

routes.post('/close-current-season',
  requireAuthentication,
  requireAdmin,
  setReqDate('finished'),
  async (req, res) => {
    const now = req.body.dates.finished;

    try {
      const openSeason = await SeasonModel.getOpenSeason();

      if (!openSeason) {
        res.status(403).send('Cannot close current season - none is open.')
      }

      const updateSeasonTransaction = await SeasonModel.updateOne({ _id: openSeason._id }, {
        'dates.finished': now,
      });

      const updateVotingSessionTransaction = await VotingSessionModel.updateOne({ _id: openSeason.votingSession._id }, {
        $set: { 'dates.finished': now },
      });

      const season = await SeasonModel.findById({ _id: openSeason._id });

      const updateBookTransaction = await BookModel.update({ _id: season.book }, {
        $set: { 'dates.finished': now },
      });

      res.header('Transactions', JSON.stringify({
        season: updateSeasonTransaction,
        votingSession: updateVotingSessionTransaction,
        book: updateBookTransaction,
      }));
      res.status(200).json(season);
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

routes.post('/start-new-voting-session',
  requireAuthentication,
  requireAdmin,
  setReqDate('created'),
  setReqDate('started'),
  async (req, res) => {
    try {
      const openVotingSession = await VotingSessionModel.getCurrentSession();
      if(!openVotingSession) {
        const session = await VotingSessionModel.create(req.body);

        res.status(201).json(session);
      } else {
        res.status(403).send('Cannot start a voting session while one is currently open.')
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

routes.post('/close-current-voting-session',
  requireAuthentication,
  requireAdmin,
  setReqDate('finished'),
  async (req, res) => {
    const bookId = req.body.book;
    const now = req.body.dates.finished;

    try {
      const openVotingSession = await VotingSessionModel.getCurrentSession();
      const currentSeason = await SeasonModel.getOpenSeason();
      const allBooks = await BookModel.find({});

      const updateVotingSessionTransaction = await VotingSessionModel.updateOne({ _id: openVotingSession._id }, {
        $set: { 'dates.finished': now },
        booksVotedOn: allBooks.filter(_ => _.status === 'SUGGESTED').map(book => book._id),
      });

      const updateSeasonTransaction = await SeasonModel.updateOne({ _id: currentSeason._id }, {
        $set: {
          'dates.started': now,
          book: bookId,
        },
      });

      const updateBookTransaction = await BookModel.update({ _id: bookId }, {
        'dates.chosen': now,
      });

      const season = await SeasonModel
        .findById({ _id: currentSeason._id })
        .populate('book')
        .populate('votingSession')
        .exec();

      res.header('Transactions', JSON.stringify({
        votingSession: updateVotingSessionTransaction,
        season: updateSeasonTransaction,
        book: updateBookTransaction,
      }));
      res.status(200).json(season);
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

routes.post('/vote-for-session',
  requireAuthentication,
  async (req, res) => {
    try {
      const session = await VotingSessionModel.getCurrentSession();

      const result = await session.replaceVotesFromUser(req.user._id.toString(), req.body);

      res.status(200).json(result);
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

routes.get('/find-book-details',
  requireAuthentication,
  async (req, res) => {
    const url = req.query.url;
    try {
      const details = await bookscraps.discover(url);
      res.status(200).json(details);
    } catch(err) {
      let body = err;
      if(err.response) {
        body = err.response.status === 401 ? 'Problem with downstream service.' : err.response.data;
      }
      res.status(500).send(body);
    }
  },
);

routes.patch('/rate-book',
  requireAuthentication,
  async (req, res) => {
    try {
      const bookId = req.body.book;
      const book = await BookModel.findById({ _id: bookId });
      const value = Math.min(5, Math.max(req.body.value, 1));

      const result = await book.replaceRatingFromUser({
        user: req.body.user,
        value: value,
      });

      res.status(200).json(result);
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

module.exports = routes;
export {}