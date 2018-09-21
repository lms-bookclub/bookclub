import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { Book } from 'types';
import { StarIcon } from 'components/icons/StarIcon';

export interface VoteCardProps {
  book: Book;
  i: number;
  points: number;
  onVote?: Function;
}

export class VoteCard extends React.Component<VoteCardProps, any> {
  render() {
    const { book, i, points, onVote } = this.props;

    return (
      <Card className='c-vote-card'>
        <CardMedia
          className={`c-vote-card__image-media${!book.links.image ? ' no-src':''}`}
          image={book.links.image ? book.links.image : '/icons/icon-book-256.png'}
          title={`${book.title} - ${book.author}`}
        />
        <div className='c-vote-card__padded'>
          <div className='c-vote-card__details'>
            <span className='c-vote-card__title'>{book.title}</span> <span className='c-vote-card__dash'>-</span> <span className='c-vote-card__author'>{book.author || '??'}</span>
          </div>
          <div className='c-vote-card__points'>
            {Array.from({ length: 3 }, (_, i) => {
              return <StarIcon
                className='i-star'
                size={24}
                fill={i < points ? '#ffeb3b' : 'none'}
                stroke='#ccc'
                onClick={this.onStarClick.bind(this, book, i + 1)}
              />
            })}
          </div>
        </div>
      </Card>
    );
  }

  onStarClick(book, points) {
    if(this.props.onVote) {
      this.props.onVote(book, points);
    }
  }
}