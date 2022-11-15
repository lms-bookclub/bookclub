import mongoose from 'lib/mongoose';
import { AdvancedAcceptanceMethod } from '@shared/types';

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
  if (votes.length > 3) {
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
    if (!slots[vote.points] || books[vote.book] || user !== vote.user) {
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

      for (let rank = 0; rank <= maxRank; rank++) {
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

/**
 * Ranking system for books.
 *
 * @param rawVotes The raw ordered votes for books per user. The top level array are the user and the inner array is the ranked order of books picked for that user.
 *                 Lower indices for books are the most preferred for that user.
 * @param booksForRanking The books that should be considered when determining the winner, there may be books in the rawVotes that are not contained here.
 *                        This is because systems like highestOriginalChoiceVote need the raw vote data to be able to compute their scores.
 *                        Even if other books have been eliminated from consideration though other tiebreaking systems. There will always be at least one book in this set.
 * @return the set of books that are winners based on the voting system, must contain at least 1 book, the books returned must be an intersection with the booksForRanking parameter.
 */
type RankingFunction = (rawVotes: string[][], booksForRanking: Set<string>) => Set<string>;

/**
 * Convenience alias to use in the forEach method. Behaves the same as the javascript Array.prototype.forEach
 */
type RankConsumerFunction = (result: { book: string, method: AdvancedAcceptanceMethod }, index: number, booksForRanking: { book: string, method: AdvancedAcceptanceMethod }[]) => void;

abstract class Ranker {
  protected readonly _rawVotes: string[][];
  protected readonly _booksForRanking: Set<string>;

  protected constructor(rawVotes: string[][], booksForRanking: Set<string>) {
    this._rawVotes = rawVotes;
    this._booksForRanking = booksForRanking;
  }

  abstract filterWinners(rankingFunction: RankingFunction, rankingMethod: AdvancedAcceptanceMethod): Ranker;

  abstract getRankingMethod(): AdvancedAcceptanceMethod;

  forEach(mapperFunction: RankConsumerFunction): Ranker {
    Array.from(this._booksForRanking)
      .map(book => { return { book: book, method: this.getRankingMethod() }; })
      .forEach(mapperFunction);
    return this;
  }

  static of(rawVotes: string[][], booksForRanking: Set<string>): Ranker {
    return booksForRanking.size > 1 ? new TiedRanker(rawVotes, booksForRanking) : new CompletedRanker(rawVotes, booksForRanking, AdvancedAcceptanceMethod.DEFAULT);
  }
};

/**
 * Implementation of Ranker when there is no clear book winner, do not construct this class directly, use Ranker.of
 */
class TiedRanker extends Ranker {
  constructor(rawVotes: string[][], booksForRanking: Set<string>) {
    if (booksForRanking.size < 2) {
      throw new Error('Too few books for a TiedRanker')
    }
    super(rawVotes, booksForRanking);
  }

  filterWinners(rankingFunction: RankingFunction, rankingMethod: AdvancedAcceptanceMethod): Ranker {
    const result = rankingFunction(this._rawVotes, this._booksForRanking);

    return result.size > 1 ? new TiedRanker(this._rawVotes, result) : new CompletedRanker(this._rawVotes, result, rankingMethod);
  }

  getRankingMethod(): AdvancedAcceptanceMethod {
    return AdvancedAcceptanceMethod.TIED;
  }
}

/**
 * Implementation of Ranker when there is a clear book winner, do not construct this class directly, use Ranker.of
 */
class CompletedRanker extends Ranker {
  private readonly _rankingMethod: AdvancedAcceptanceMethod;

  constructor(rawVotes: string[][], booksForRanking: Set<string>, rankingMethod: AdvancedAcceptanceMethod) {
    if (booksForRanking.size > 1) {
      throw new Error('Too many books for a CompletedRanker')
    }

    super(rawVotes, booksForRanking);
    this._rankingMethod = rankingMethod;
  }

  filterWinners(_rankingFunction: RankingFunction, _rankingMethod: AdvancedAcceptanceMethod): Ranker {
    return this;
  }

  getRankingMethod(): AdvancedAcceptanceMethod {
    return this._rankingMethod;
  }
}

function calculateResultsForAcceptanceWithInstantRunoff(votes: { user: string | { _id: string }, book: string | { _id: string }, rank: number }[] = []): { book: string, rankings: number[], method: AdvancedAcceptanceMethod, tiedCount: number }[] {
  const normalizedVotes = votes.map(({ user, book, rank }) => {
    const normalizedUser = typeof user === "string" ? user : user._id;
    const normalizedBook = typeof book === "string" ? book : book._id;
    return { user: normalizedUser, book: normalizedBook, rank: rank };
  });
  const votesPerUser = normalizedVotes
    .reduce(
      (groupedVotes, { user, book, rank }) => {
        let votesForUser = groupedVotes.get(user) || new Array<{ book: string, rank: number }>();
        votesForUser.push({ book: book, rank: rank });
        return groupedVotes.set(user, votesForUser);
      },
      new Map<string, { book: string, rank: number }[]>())
    .values();

  const rawVotes = Array.from(votesPerUser)
    .map(votes =>
      votes
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2)
        .map(({ book }) => book));

  // Each voting system is allowed to return a Tie for winners. If there is a tie, the next voting system in the list will attempt to break the tie
  const votingSystems: [RankingFunction, AdvancedAcceptanceMethod][] = [
    [acceptanceVote, AdvancedAcceptanceMethod.BASIC_ACCEPTANCE],
    [instantRunoffVote, AdvancedAcceptanceMethod.INSTANT_RUNOFF], // commenting this out would make the method the same as calculateResultsForAcceptance
    [highestOriginalChoiceVote, AdvancedAcceptanceMethod.MOST_PRIORITY],
  ];

  const booksForRanking = normalizedVotes
    .map(({ book }) => book)
    .reduce((books, book) => books.add(book), new Set<string>());

  const bookToRankings = Array.from(normalizedVotes
    .map(({ book: book, rank: rank }) => { return { book: book, rank: rank } })
    .reduce(
      (books, { book, rank }) => {
        let bookRanks = books.get(book)!;
        bookRanks.push(rank);
        return books.set(book, bookRanks);
      },
      Array.from(booksForRanking)
        .reduce((books, book) => books.set(book, []), new Map<string, number[]>())
    ))
    .map(([book, rankings]) => [book, rankings.sort((a, b) => a - b)] as [string, number[]])
    .reduce((books, [book, rankings]: [string, number[]]) => books.set(book, rankings), new Map<string, number[]>());

  // find the winner(s) for each cohort, remove them, then run the vote tally again to find the next best book, repeat until no books remain
  const results: { book: string; rankings: number[]; method: AdvancedAcceptanceMethod; tiedCount: number; }[] = [];

  while (booksForRanking.size > 0) {
    votingSystems
      .reduce(
        (ranker, system) => ranker.filterWinners(...system),
        Ranker.of(rawVotes, booksForRanking))
      .forEach(({ book, method }, _index, books) => {
        booksForRanking.delete(book);
        results.push({
          book: book,
          rankings: bookToRankings.get(book)!,
          method,
          tiedCount: books.length,
        });
      });
  }

  return results;
}

function acceptanceVote(rawVotes: string[][], booksForRanking: Set<string>): Set<string> {
  const bookVoteCount = rawVotes
    .flat()
    .filter((book) => booksForRanking.has(book))
    .reduce(
      (books, book) => books.set(book, books.get(book)! + 1),
      Array.from(booksForRanking).reduce((books, book) => books.set(book, 0), new Map<string, number>()));

  const ranked_books = Array.from(bookVoteCount)
    .reduce(
      (ranks, [book, count]) => ranks.set(count, (ranks.get(count) || new Set<string>()).add(book)),
      new Map<number, Set<string>>());

  return Array.from(ranked_books)
    .sort(([count1, _books1], [count2, _books2]) => count2 - count1)
    .map(([_count, books]) => books)[0];
}

function instantRunoffVote(rawVotes: string[][] = [], booksForRanking: Set<string> = new Set()): Set<string> {
  const filteredVotes = rawVotes
    .map(votes => votes.filter((book) => booksForRanking.has(book)))
    .filter(votes => votes.length > 0);

  const bookResults = filteredVotes
    .map(votes => votes[0]) // We already filtered out empty lists
    .reduce(
      (books, book) => books.set(book, books.get(book)! + 1),
      Array.from(booksForRanking).reduce((books, book) => books.set(book, 0), new Map<string, number>()));

  const totalVotes = Array.from(bookResults.values())
    .reduce((sum, count) => sum + count, 0);
  const minVote = Array.from(bookResults.values())
    .reduce((min, count) => count < min ? count : min, totalVotes);
  const maxVote = Array.from(bookResults.values())
    .reduce((max, count) => count > max ? count : max, 0);

  // Tie
  if (minVote === maxVote) {
    return new Set<string>(Array.from(bookResults.keys()));
  }

  const clearWinner = new Set<string>(Array.from(bookResults)
    .filter(([_book, count]) => count / totalVotes > 0.5)
    .map(([book, _count]) => book));

  if (clearWinner.size > 0) {
    return clearWinner;
  }

  const losers = new Set<string>(Array.from(bookResults)
    .filter(([_book, count]) => count === minVote)
    .map(([book, _count]) => book));

  return instantRunoffVote(filteredVotes, new Set<string>(Array.from(booksForRanking).filter(book => !losers.has(book))))
}

function highestOriginalChoiceVote(rawVotes: string[][], booksForRanking: Set<string>): Set<string> {
  const booksToVoteCounts = rawVotes
    .flatMap(votes => votes.map((book, index) => { return { book: book, rank: index }; }))
    .filter(bookRank => booksForRanking.has(bookRank.book))
    .reduce(
      (books, bookRank) => {
        const book = books.get(bookRank.book)!;
        return books.set(bookRank.book, book.set(bookRank.rank, (book.get(bookRank.rank) || 0) + 1));
      },
      Array.from(booksForRanking).reduce((books, book) => books.set(book, new Map<number, number>()), new Map<string, Map<number, number>>()));

  const maxRank = Array.from(booksToVoteCounts.values()).flatMap((voteCounts) => Array.from(voteCounts.keys()))
    .reduce((max, current) => current > max ? current : max, 0);

  const groupedResults = Array.from(booksToVoteCounts)
    .map(([book, voteCounts]) => {
      let key = new Array<number>(maxRank + 1).fill(0);
      Array.from(voteCounts)
        .forEach(([rank, count]) => key[rank] = count);
      return [key, book] as [number[], string];
    })
    .reduce(
      (keyToBooks, [key, book]: [number[], string]) => {
        const stringKey = JSON.stringify(key); // This allows equality checking in an easy way
        let books = keyToBooks.get(stringKey) || { books: new Set<string>(), key: key };
        books.books.add(book);
        return keyToBooks.set(stringKey, books);
      },
      new Map<string, { books: Set<string>, key: number[] }>());

  return Array.from(groupedResults.values())
    .sort(({ key: key1 }, { key: key2 }) =>
      key1
        .map((rank1, index) => key2[index] - rank1)
        .find(value => value !== 0)! // undefined is not possible as we've already checked for equality and grouped them
    )
    .map(({ books }) => books)[0];
}

const VotingSessionSchema = new mongoose.Schema({
  system: {
    type: String,
    enum: [
      'WEIGHTED_3X',
      'ACCEPTANCE_WITH_RANKED_TIEBREAKER',
      'ADVANCED_ACCEPTANCE',
    ],
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
    }
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

VotingSessionSchema.virtual('status').get(function () {
  return this.dates.finished
    ? 'COMPLETE'
    : this.dates.started
      ? 'OPEN'
      : 'PREPARED';
});

VotingSessionSchema.virtual('results').get(function () {
  return {
    ['ADVANCED_ACCEPTANCE']: calculateResultsForAcceptanceWithInstantRunoff(this.votes),
    ['ACCEPTANCE_WITH_RANKED_TIEBREAKER']: calculateResultsForAcceptance(this.votes),
    ['WEIGHTED_3X']: calculateResultsForWeighted(this.votes),
  }[this.system];
});

VotingSessionSchema.statics.getCurrentSession = function () {
  const Model = this;
  return Model.find({
    "dates.finished": {
      $exists: false,
    },
  }).then(models => {
    if (models.length < 2) {
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
VotingSessionSchema.methods.replaceVotesFromUser = async function (userId, votes) {
  const instance = this;

  const isValid = {
    ['ADVANCED_ACCEPTANCE']: areVotesValidForAcceptance(votes, userId),
    ['ACCEPTANCE_WITH_RANKED_TIEBREAKER']: areVotesValidForAcceptance(votes, userId),
    ['WEIGHTED_3X']: areVotesValidForWeighted(votes, userId),
  }[this.system];

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