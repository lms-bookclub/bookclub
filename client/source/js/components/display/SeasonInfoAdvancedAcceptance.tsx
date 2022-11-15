import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { BookStatus, Season, VotingSession, VotingSessionStatus } from 'types';
import { BookCard } from 'components/display/BookCard';
import { ConfirmDialog } from 'components/display/ConfirmDialog';
import { toStandardString } from 'utils/dates';
import { toJSON } from 'utils/objects';
import TextField from '@material-ui/core/TextField/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { VoteResultCardAdvancedAcceptance } from '@client/components/display/VoteResultCardAdvancedAcceptance';

const RatingDescriptions = [
  `5 - I would recommend this book to everyone - regardless of their interested in the genre. Everyone should read this book.`,
  `4 - I would recommend this book to someone interested in the genre.`,
  `3 - Good book to read if you have the time.`,
  `2 - Don't recommend. It was ok.`,
  `1 - I didn't like it, and no one should read this book.`,
];

function getUserRating(book, myId?): number {
  if(!myId) return -1;
  const rating = book ? book.ratings.find(rating => rating.user === myId) : null;
  return rating ? rating.value : -1;
}

function rankingsForBookFromVoting(book, votingSession) {
  if(votingSession.status !== VotingSessionStatus.COMPLETE) return;
  const vote = votingSession.results.find(_ => _.book === book._id);
  return vote ? vote.rankings : [];
}

function voteResultsList(books = {}, votingSession: VotingSession, seasonBook = {}) {
  const {
    results,
    booksVotedOn,
  } = {
    results: [],
    booksVotedOn: [],
    ...votingSession
  };
  const winner = results[0];
  const list = (booksVotedOn && booksVotedOn.length > 0 ? booksVotedOn : Object.keys(books))
    .filter(bookId => books[bookId])
    .map(bookId => {
      const book = books[bookId];
      const result = results.find(_ => _.book === book._id);
      book.rankings = result ? result.rankings : [];
      book.method = result ? result.method : null;
      book.tiedCount = result ? result.tiedCount : 1;
      return book;
    })
    .filter(_ => _._id !== winner.book && (booksVotedOn.length > 0 || _.status !== BookStatus.BACKLOG) && _._id)
  ;
    // .sort((a, b) => {
    //   const diff = b.rankings.length - a.rankings.length;
    //   if (diff > 0) {
    //     return 1;
    //   }
    //   if (diff < 0) {
    //     return -1;
    //   }
    //
    //   const maxRank = Math.max(
    //     a.rankings[a.rankings.length - 1],
    //     b.rankings[b.rankings.length - 1],
    //   );
    //
    //   for(let rank = 0; rank <= maxRank; rank++) {
    //     const aVotesAtRank = a.rankings.filter(vote => vote === rank).length;
    //     const bVotesAtRank = b.rankings.filter(vote => vote === rank).length;
    //     const votesAtRankDiff = bVotesAtRank - aVotesAtRank;
    //
    //     if (votesAtRankDiff > 0) {
    //       return 1;
    //     }
    //     if (votesAtRankDiff < 0) {
    //       return -1;
    //     }
    //   }
    //
    //   return 0;
    // });
  return list;
}

function renderDate(label, timestamp) {
  return <Typography component='p' className='c-season-info__date'>
    <label>{label}: </label>
    <span>{toStandardString(timestamp)}</span>
  </Typography>
}

export interface SeasonInfoAdvancedAcceptanceProps {
  season: Season;
  votingSession: VotingSession;
  onSeasonClose: Function;
  onSeasonRename?: Function;
  onRateBook?: Function;
  allowClosing: boolean;
  title: string;
  books?: any;
  startVotingOpen?: boolean;
  myId?: any;
}

export interface SeasonInfoAdvancedAcceptanceState {
  anchorEl: HTMLElement;
  closeSeasonDialogOpen: boolean;
  renameSeasonDialogOpen: boolean;
  rateBookDialogOpen: boolean;
  showJson: boolean;
  showVotingResults: boolean;
  seasonTitle: string;
  userBookRating: number;
  isRatingValid: boolean;
}

function ensure(props: SeasonInfoAdvancedAcceptanceProps): SeasonInfoAdvancedAcceptanceProps {
  return {
    season: {
      dates: {
        created: null,
        ...props.season.dates,
      },
      ...props.season,
    },
    votingSession: {
      ...props.votingSession,
      status: null,
    },
    startVotingOpen: props.hasOwnProperty('startVotingOpen') ? props.startVotingOpen : true,
    ...props,
  }
}

export class SeasonInfoAdvancedAcceptance extends React.Component<SeasonInfoAdvancedAcceptanceProps, SeasonInfoAdvancedAcceptanceState> {
  closeSeasonDialog: ConfirmDialog;
  renameSeasonDialog: ConfirmDialog;
  rateBookDialog: ConfirmDialog;

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      closeSeasonDialogOpen: false,
      renameSeasonDialogOpen: false,
      rateBookDialogOpen: false,
      showJson: false,
      seasonTitle: props.season ? props.season.title || '' : '',
      showVotingResults: props.startVotingOpen,
      userBookRating: getUserRating(props.season.book, props.myId),
      isRatingValid: true,
    };

    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleCloseSeasonClick = this.handleCloseSeasonClick.bind(this);
    this.handleCloseSeasonConfirm = this.handleCloseSeasonConfirm.bind(this);
    this.handleRenameSeasonClick = this.handleRenameSeasonClick.bind(this);
    this.handleRenameSeasonConfirm = this.handleRenameSeasonConfirm.bind(this);
    this.handleRateBookClick = this.handleRateBookClick.bind(this);
    this.handleRateBookConfirm = this.handleRateBookConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleToggleVotingResultsClick = this.handleToggleVotingResultsClick.bind(this);
    this.showJson = this.showJson.bind(this);
    this.hideJson = this.hideJson.bind(this);
  }

  render() {
    const { season, votingSession, onSeasonRename, allowClosing, title } = ensure(this.props);
    const { anchorEl, showJson, showVotingResults } = this.state;

    const isVotingSessionClosed = votingSession.status === VotingSessionStatus.COMPLETE;
    const allowToggleVotingResults = isVotingSessionClosed;
    const allowRenaming = !!onSeasonRename;
    const allowRating = isVotingSessionClosed && this.props.myId && this.props.onRateBook;
    const showMenu = allowClosing || allowToggleVotingResults || allowRenaming || allowRating;

    return (
      <div>
        <Paper className='c-season-info' elevation={1}>
          <div className='c-season-info__header o-action-title'>
            <Typography variant='headline' component='h3'>
              {season.title || title}
            </Typography>
            {showMenu ?
              <div>
                <IconButton
                  aria-label='Actions'
                  aria-haspopup='true'
                  aria-owns={anchorEl ? 'season-info-actions-menu' : null}
                  onClick={this.handleMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id='season-info-actions-menu'
                  anchorEl={anchorEl}
                  open={!!anchorEl}
                  onClose={this.handleMenuClose}
                >
                  {allowToggleVotingResults ? <MenuItem onClick={this.handleToggleVotingResultsClick}>{showVotingResults ? 'Hide Voting Results' : 'Show Voting Results'}</MenuItem> : null}
                  {allowRenaming ? <MenuItem onClick={this.handleRenameSeasonClick}>Rename Season</MenuItem> : null}
                  {allowClosing ? <MenuItem onClick={this.handleCloseSeasonClick}>Close Season</MenuItem> : null}
                  {allowRating ? <MenuItem onClick={this.handleRateBookClick}>Rate Book</MenuItem> : null}
                </Menu>
              </div>
            : null}
          </div>
          <ConfirmDialog
            open={this.state.closeSeasonDialogOpen}
            title='Close this season?'
            content={
              <DialogContentText>Are you sure you want to close the current season? This action cannot be undone.</DialogContentText>
            }
            confirmText='Close Season'
            confirmColor='secondary'
            onRef={(ref) => (this.closeSeasonDialog = ref)}
            onConfirm={this.handleCloseSeasonConfirm}
            onCancel={this.handleDialogClose}
          />

          <ConfirmDialog
            open={this.state.renameSeasonDialogOpen}
            title='Rename Season'
            content={
              <form onSubmit={this.handleRenameSeasonConfirm}>
                <TextField
                  id='season-title-rename'
                  label='Season Title'
                  className='o-field o-field--text'
                  value={this.state.seasonTitle}
                  onChange={(e) => this.setState({ seasonTitle: e.target.value })}
                  margin='normal'
                  type='text'
                />
              </form>
            }
            confirmText='Rename Season'
            onRef={(ref) => (this.renameSeasonDialog = ref)}
            onConfirm={this.handleRenameSeasonConfirm}
            onCancel={this.handleDialogClose}
          />

          <ConfirmDialog
            open={this.state.rateBookDialogOpen}
            title='Rate Book'
            content={
              <form onSubmit={this.handleRateBookConfirm} noValidate>
                <FormControl error={!this.state.isRatingValid}>

                  <TextField
                    id='season-rate-book'
                    label='Your Rating'
                    className='o-field o-field--text'
                    value={this.state.userBookRating > -1 ? this.state.userBookRating : ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      this.setState({ userBookRating: value, isRatingValid: value >= 1 && value <= 5 })}
                    }
                    margin='normal'
                    type='number'
                    inputProps={{
                      min: 1.0,
                      max: 5.0,
                      step: 0.1,
                    }}
                  />

                  <FormHelperText>{this.state.isRatingValid ? '' : 'Rating must be between 1 and 5'}</FormHelperText>

                  {RatingDescriptions.map((description, i) =>
                    <DialogContentText className='c-season-info__rating-description' key={i}>{description}</DialogContentText>
                  )}
                </FormControl>
              </form>
            }
            confirmText='Rate Book'
            onRef={(ref) => (this.rateBookDialog = ref)}
            onConfirm={this.handleRateBookConfirm}
            onCancel={this.handleDialogClose}
          />

          <div className='c-season-info__details'>
            {season.dates.created ?
              renderDate('Started', season.dates.created)
              : null}
            {season.dates.started ?
              renderDate('Book Chosen', season.dates.started)
              : null}
            {season.dates.finished ?
              renderDate('Finished', season.dates.finished)
              : null}
          </div>
          {showJson ?
            <div className='c-season-info__admin-info'>
              <div className='o-json-dump'>
                <span>Season JSON</span>
                <pre>{toJSON(season)}</pre>
              </div>
            </div>
          : null}
          {season.book ?
            <div className='c-season-info__book'>
              <BookCard
                book={season.book}
                rankings={showVotingResults ? rankingsForBookFromVoting(season.book, votingSession) : undefined}
                borderless={true}
              />
            </div>
            : null}
          {showVotingResults && isVotingSessionClosed ?
            <div className='c-season-info__voting-results'>
              {voteResultsList(this.props.books, votingSession, season.book).map((book, i) =>
                <VoteResultCardAdvancedAcceptance
                  key={i}
                  book={book}
                />
              )}
            </div>
            : null}
        </Paper>
      </div>
    );
  }

  handleMenuOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
      closeSeasonDialogOpen: false,
      renameSeasonDialogOpen: false,
      rateBookDialogOpen: false,
    });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleDialogClose() {
    this.setState({
      closeSeasonDialogOpen: false,
      renameSeasonDialogOpen: false,
      rateBookDialogOpen: false,
      seasonTitle: this.props.season ? this.props.season.title || '' : '',
    });
  }

  handleCloseSeasonClick() {
    this.setState({
      closeSeasonDialogOpen: true,
      anchorEl: null,
    });
  }

  handleRenameSeasonClick() {
    this.setState({
      renameSeasonDialogOpen: true,
      anchorEl: null,
    });
  }

  handleRateBookClick() {
    this.setState({
      userBookRating: getUserRating(this.props.season.book, this.props.myId),
      isRatingValid: true,
      rateBookDialogOpen: true,
      anchorEl: null,
    });
  }

  handleToggleVotingResultsClick() {
    this.setState({
      showVotingResults: !this.state.showVotingResults,
      anchorEl: null,
    });
  }

  handleCloseSeasonConfirm() {
    this.handleDialogClose();
    this.props.onSeasonClose();
  }

  handleRateBookConfirm(e) {
    if(e) {
      e.preventDefault();
    }
    if(this.state.isRatingValid) {
      const { userBookRating } = this.state;
      this.handleDialogClose();
      this.props.onRateBook({
        book: this.props.season.book,
        value: userBookRating,
      });
    }
  }

  handleRenameSeasonConfirm(e?) {
    if(e) {
      e.preventDefault();
    }
    this.props.onSeasonRename(this.state.seasonTitle);
    this.handleDialogClose();
  }

  showJson() {
    this.setState({
      showJson: true,
      anchorEl: null,
    });
  }

  hideJson() {
    this.setState({
      showJson: false,
      anchorEl: null,
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      seasonTitle: props.season ? props.season.title || '' : '',
    })
  }
}