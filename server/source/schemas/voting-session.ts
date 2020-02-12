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
function areVotesValidForWeighted(votes, user) {
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

function areVotesValidForAcceptance(votes, user) {
  const slots = {};

  return votes.every(vote => {
    // Already exists
    if (vote.rank < 0) {
      return true;
    } else if (slots[vote.rank] || vote.rank >= votes.length) {
      return false;
    } else {
      slots[vote.rank] = vote;
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
function calculateResultsForWeighted(votes: { user: string, book: string, points: number }[] = []): { book: string, points: number }[] {
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

function calculateResultsForAcceptance(votes: { user: string, book: string, rank: number }[] = []): { book: string, rankings: number[] }[] {
  const votesByBook = votes.reduce((votes, vote) => {
    const existing = votes[vote.book] || [];
    return {
      ...votes,
      [vote.book]: [...existing, vote.rank >= 0 ? vote.rank : undefined],
    }
  }, {});

  return Object
    .keys(votesByBook)
    .map(book => ({
      book,
      rankings: votesByBook[book]
        .filter(rank => rank !== undefined)
        .sort((a, b) => a - b)
    }))
    .sort((a, b) => {
      const diff = b.rankings.length - a.rankings.length;
      if (diff > 0) {
        return 1;
      }
      if (diff < 0) {
        return -1;
      }

      const maxRank = Math.max(
        a.rankings[a.rankings.length - 1],
        b.rankings[b.rankings.length - 1],
      );

      for(let rank = 0; rank <= maxRank; rank++) {
        const aVotesAtRank = a.rankings.filter(vote => vote === rank).length;
        const bVotesAtRank = b.rankings.filter(vote => vote === rank).length;
        const votesAtRankDiff = bVotesAtRank - aVotesAtRank;

        if (votesAtRankDiff > 0) {
          return 1;
        }
        if (votesAtRankDiff < 0) {
          return -1;
        }
      }

      return 0;
    });
}

const VotingSessionSchema = new mongoose.Schema({
  system: {
    type: String,
    enum: ['WEIGHTED_3X', 'ACCEPTANCE_WITH_RANKED_TIEBREAKER'],
    default: 'WEIGHTED_3X',
  },

  booksVotedOn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],

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
    },
    rank: {
      type: Number,
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
  return this.system === 'ACCEPTANCE_WITH_RANKED_TIEBREAKER'
    ? calculateResultsForAcceptance(this.votes)
    : calculateResultsForWeighted(this.votes);
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

  const isValid = this.system === 'ACCEPTANCE_WITH_RANKED_TIEBREAKER'
    ? areVotesValidForAcceptance(votes, userId)
    : areVotesValidForWeighted(votes, userId);

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