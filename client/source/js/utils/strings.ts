/**
 * Normalize a string to hyphenated lower case.
 * Source: https://gist.github.com/mathewbyrne/1280286
 *
 * @param {string} str
 * @returns {string}
 */
export function normalize(str: string): string {
  return str.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Generates a string '1 point' or 'x points', based on the point value provided.
 *
 * @param {number} points
 * @returns {string}
 */
export function pointString(points: number): string {
  return `${points} ${points === 1 ? 'point' : 'points'}`;
}

export const rankString = (rawRank) => {
  if (rawRank === -1) {
    return '--'
  }
  const visualRank = parseInt(rawRank, 10) + 1;
  const ending = visualRank === 1 ? 'st' :
    visualRank === 2 ? 'nd' :
      visualRank === 3 ? 'rd' :
        'th';
  return `${visualRank}${ending}`
};

export function acceptanceVoteResultsString(votes: (string|number)[] = []): string {
  // const ranks = votes.reduce((ranks, rank) => {
  //   ranks[rank] = (ranks[rank] || 0) + 1;
  //   return ranks;
  // }, {});
  //
  // const allRanksString = Object.keys(ranks)
  //   .map(rank => `${ranks[rank]}x ${rankString(rank)}`)
  //   .join(', ');

  return `${votes.length} ${votes.length === 1 ? 'vote' : 'votes'} (${votes.map(rankString).join(', ')})`;
}