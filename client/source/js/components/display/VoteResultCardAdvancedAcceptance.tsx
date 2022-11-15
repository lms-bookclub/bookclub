import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Book } from 'types';
import { acceptanceVoteResultsString } from 'utils/strings';

export interface VoteResultCardAdvancedAcceptanceProps {
  book: Book;
}

export class VoteResultCardAdvancedAcceptance extends React.Component<VoteResultCardAdvancedAcceptanceProps, any> {
  render() {
    const { book } = this.props;

    return (
      <Card className='c-vote-card c-vote-card--result'>
        <CardMedia
          className={`c-vote-card__image-media${!book.links.image ? ' no-src':''}`}
          image={book.links.image ? book.links.image : '/icons/icon-book-256.png'}
          title={`${book.title} - ${book.author}`}
        />
        <div className='c-vote-card__padded'>
          <div className='c-vote-card__details'>
            <span className='c-vote-card__title'>{book.title}</span> <span className='c-vote-card__dash'>-</span> <span className='c-vote-card__author'>{book.author || '??'}</span>
            <span>{book.method} {book.tiedCount}</span>
          </div>
          <div className='c-vote-card__points'>
            <span className='c-vote-card__points-text'>{acceptanceVoteResultsString(book.rankings)}</span>
          </div>
        </div>
      </Card>
    );
  }
}