import mongoose from 'lib/mongoose';

/**
 * Must contain 3 votes.
 * All votes are from same user.
 * Cannot vote for same book twice
 * Must use only but all: 1, 2, and 3 point slots
 *
 * @param votes
 * @param user
 */
function areVotesValid(votes, user) {
  if(votes.length !== 3) {
    return false;
  }

  // Available slots (true-by-default to prevent non-valid point votes)
  const slots = {
    1: true,
    2: true,
    3: true,
  };

  // Add books to this map, if a check is true, it's already been voted for by this collection
  const books = {};

  return votes.every(vote => {
    if(!slots[vote.points] || books[vote.book] || user !== vote.user) {
      return false;
    } else {
      slots[vote.points] = false;
      books[vote.book] = true;
      return true;
    }
  });
}

/**
 * Total the votes given a list of votes. Excepts the 'book' field in the param to be a string.
 *
 * @param {{
 *  user: string,
 *  book: string,
 *  points: number,
 * }[]} votes
 * @returns {{
 *  book: string,
 *  points: number,
 * }[]}
 */
function calculateResults(votes: { user: string, book: string, points: number }[] = []): { book: string, points: number }[] {
  const votesByBook = votes.reduce((votes, vote) => {
    return {
      ...votes,
      [vote.book]: (votes[vote.book] || 0) + vote.points,
    }
  }, {});

  return Object
    .keys(votesByBook)
    .map(book => ({ book, points: votesByBook[book] }))
    .sort((a, b) => b.points - a.points);
}

const VotingSessionSchema = new mongoose.Schema({
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  }],

  dates: {
    created: {
      type: Date,
      required: true,
    },
    started: {
      type: Date,
    },
    finished: {
      type: Date,
    },
  },
}, {
  id: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
  }
});

VotingSessionSchema.virtual('status').get(function() {
  return this.dates.finished
    ? 'COMPLETE'
    : this.dates.started
      ? 'OPEN'
      : 'PREPARED';
});

VotingSessionSchema.virtual('results').get(function() {
  return calculateResults(this.votes);
});

VotingSessionSchema.statics.getCurrentSession = function() {
  const Model = this;
  return Model.find({
    "dates.finished": {
      $exists: false,
    },
  }).then(models => {
    if(models.length < 2) {
      return models[0];
    } else {
      throw 'Error: too many open sessions.';
    }
  });
};

/**
 *
 * @param {string} userId
 * @param votes
 */
VotingSessionSchema.methods.replaceVotesFromUser = async function(userId, votes) {
  const instance = this;

  const isValid = areVotesValid(votes, userId);

  if (!isValid) {
    throw 'Cannot replace votes - new votes invalid.';
  }

  instance.votes = [
    ...instance.votes.filter(_ => _.user.toString() !== userId),
    ...votes,
  ];

  return await instance.save();
};

const VotingSessionModel = mongoose.model('VotingSession', VotingSessionSchema);

export {
  VotingSessionModel,
  VotingSessionSchema
};