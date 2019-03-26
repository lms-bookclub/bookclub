import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classnames from 'classnames';
import { Book, BookStatus } from 'types';
import { roundToNearest } from '@shared/utils/math';
import { ensureGoodreadsUrlIsShort, ensureGoodreadsUrlIsValid } from 'utils/goodreads';
import { normalize, pointString } from 'utils/strings';

const ensureProps = (book) => ({
  meta: {},
  pitch: '',
  genre: '',
  status: '',
  ...book,
  links: {
    goodreads: '',
    image: '',
    ...book.links,
  },
  suggestedBy: (book.suggestedBy && typeof book.suggestedBy === 'object') ? {
    name: '',
    ...book.suggestedBy,
  } : (book.suggestedBy || ''),
});

function renderStatus(status, points = null) {
  if(status === BookStatus.BACKLOG) return null;

  const className = classnames({
    'c-book-card__status': true,
    [`c-book-card__status--${normalize(status)}`]: !!status,
    'has-points': points,
  });
  return <span className={className}>{points ? pointString(points) : status}</span>;
}

function yourRating(ratings: any[], myId: string) {
  const yours = ratings.find(rating => rating.user === myId);
  return yours ? `(you gave ${yours.value})` : '';
}

function formatRating(rating) {
  return Math.trunc(roundToNearest(rating, 0.1) * 10) / 10;
}

export interface BookListItemProps {
  book: Book;
  isAdmin?: boolean;
  myId?: string;
  onEdit?: Function;
  onDelete?: Function;
  onPropose?: Function;
  onRetract?: Function;
  points?: string|number;
  borderless?: boolean;
}

export class BookCard extends React.Component<BookListItemProps, any> {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };

    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePropose = this.handlePropose.bind(this);
    this.handleRetract = this.handleRetract.bind(this);
  }

  render() {
    const { myId, isAdmin, borderless } = this.props;
    const { anchorEl } = this.state;
    const book = ensureProps(this.props.book);
    const className = classnames('c-book-card', {
      'c-book-card--borderless': borderless,
    });

    const canEdit = myId === book.suggestedBy || isAdmin;

    const actions = {
      edit: canEdit && this.props.onEdit,
      delete: canEdit && this.props.onDelete,
      propose: canEdit && this.props.onPropose && book.status === BookStatus.BACKLOG,
      retract: canEdit && this.props.onRetract && book.status === BookStatus.SUGGESTED,
    };

    const showActionDropdown = actions.edit || actions.delete || actions.propose || actions.retract;

    return (
      <Card className={className}>
        <CardMedia
          className={`c-book-card__image-media${!book.links.image ? ' no-src':''}`}
          image={book.links.image ? book.links.image : '/icons/icon-book-256.png'}
          title={`${book.title} - ${book.author}`}
        />
        <div className='c-book-card__details'>
          <CardHeader
            title={book.title}
            subheader={book.author}
            action={
              showActionDropdown ? <IconButton
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup='true'
                onClick={this.handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton> : null
            }
          />

          {showActionDropdown ?
            <Menu
              id='book-card-menu'
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={this.handleMenuClose}
            >
              {actions.edit ? <MenuItem onClick={this.handleEdit}>Edit</MenuItem> : null}
              {actions.delete ? <MenuItem onClick={this.handleDelete}>Delete</MenuItem> : null}
              {actions.propose ? <MenuItem onClick={this.handlePropose}>Suggest</MenuItem> : null}
              {actions.retract ? <MenuItem onClick={this.handleRetract}>Move to backlog</MenuItem> : null}
            </Menu>
          : null}

          <CardContent>
            {renderStatus(book.status, this.props.points)}
            {book.status === BookStatus.FINISHED ?
              <span className='c-book-card__detail c-book-card__detail--rating'>
                <label>Rating: </label>
                <span>
                  {book.hasOwnProperty('averageRating') && book.averageRating > -1
                    ? `${formatRating(book.averageRating)} average from ${book.ratings.length} ratings ${yourRating(book.ratings, myId)}`
                    : 'No ratings yet'
                  }
                </span>
              </span>
            : null}
            {book.genre ?
              <span className='c-book-card__detail c-book-card__detail--genre'>
                <label>Genre: </label>
                <span>{book.genre}</span>
              </span>
            : null}
            <span className='c-book-card__detail c-book-card__detail--goodreads'>
              <label>Goodreads: </label>
              <a href={book.links.goodreads ? ensureGoodreadsUrlIsValid(book.links.goodreads) : '#'} target='_blank'>{ensureGoodreadsUrlIsShort(book.links.goodreads)}</a>
            </span>
            {book.pitch ?
              <span className='c-book-card__detail c-book-card__detail--pitch'>
                <label>Pitch: </label>
                <span>{book.pitch}</span>
              </span>
            : null}
          </CardContent>
        </div>
      </Card>
    );
  }

  handleMenuOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleEdit() {
    this.handleMenuClose();
    this.props.onEdit(this.props.book);
  }

  handleDelete() {
    this.handleMenuClose();
    this.props.onDelete(this.props.book);
  }

  handlePropose() {
    this.handleMenuClose();
    this.props.onPropose(this.props.book);
  }

  handleRetract() {
    this.handleMenuClose();
    this.props.onRetract(this.props.book);
  }
}