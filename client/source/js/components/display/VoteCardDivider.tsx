import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

export interface VoteCardDividerProps {
}

export class VoteCardDivider extends React.Component<VoteCardDividerProps, any> {
  render() {
    return (
      <Card className='c-vote-card'>
        <CardMedia
          className={`c-vote-card__image-media`}
          title={`Divider`}
        />
        <div className='c-vote-card__padded'>
          <div className='c-vote-card__details'>
            <span className='c-vote-card__author'>----------</span> <span className='c-vote-card__title'>NO INTEREST BELOW THIS LINE</span> <span className='c-vote-card__author'>----------</span>
          </div>
        </div>
      </Card>
    );
  }
}