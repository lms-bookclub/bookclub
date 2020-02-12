export type User = any;
export type Book = any;
export type Season = any;
export type Vote = any;
export type VotingSession = {
  _id: string;
  votes: Vote[];
  dates: any;
  status: string;
  results: {
    book: string,
    points?: string|number,
    rankings?: number[],
  }[];
  booksVotedOn: (string|Book)[];
}

export enum SeasonStatus {
  PREPARED = 'PREPARED',
  STARTED = 'STARTED',
  COMPLETE = 'COMPLETE',
}

export enum VotingSessionStatus {
  PREPARED = 'PREPARED',
  OPEN = 'OPEN',
  COMPLETE = 'COMPLETE',
}

export enum BookStatus {
  BACKLOG = 'BACKLOG',
  SUGGESTED = 'SUGGESTED',
  READING = 'READING',
  FINISHED = 'FINISHED',
}