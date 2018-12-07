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
import { VoteResultCard } from 'components/display/VoteResultCard';
import { toStandardString } from 'utils/dates';
import { toJSON } from 'utils/objects';

function pointsForBookFromVoting(book, votingSession) {
  if(votingSession.status !== VotingSessionStatus.COMPLETE) return;
  const vote = votingSession.results.find(_ => _.book === book._id);
  return vote ? vote.points : 0;
}

function voteResultsList(books = {}, results = [], seasonBook = {}) {
  const winner = results[0];
  const list = Object.keys(books)
    .map(bookId => {
      const book = books[bookId] || {
        _id: bookId,
      };
      const result = results.find(_ => _.book === book._id);
      book.points = result ? result.points : 0;
      return book;
    })
    .filter(_ => _._id !== winner.book && _.status !== BookStatus.BACKLOG && _._id)
    .sort((a, b) => b.points - a.points);
  return list;
}

function renderDate(label, timestamp) {
  return <Typography component='p' className='c-season-info__date'>
    <label>{label}: </label>
    <span>{toStandardString(timestamp)}</span>
  </Typography>
}

export interface SeasonInfoProps {
  season: Season;
  votingSession: VotingSession;
  onSeasonClose?: Function;
  allowJsonViewing: boolean;
  allowClosing: boolean;
  title: string;
  books?: any;
  startVotingOpen?: boolean;
}

export interface SeasonInfoState {
  anchorEl: HTMLElement;
  closeSeasonDialogOpen: boolean;
  showJson: boolean;
  showVotingResults: boolean;
}

function ensure(props: SeasonInfoProps): SeasonInfoProps {
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

export class SeasonInfo extends React.Component<SeasonInfoProps, SeasonInfoState> {
  closeSeasonDialog: ConfirmDialog;

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      closeSeasonDialogOpen: false,
      showJson: false,
      showVotingResults: props.startVotingOpen,
    };

    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleCloseSeasonClick = this.handleCloseSeasonClick.bind(this);
    this.handleCloseSeasonConfirm = this.handleCloseSeasonConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleToggleVotingResultsClick = this.handleToggleVotingResultsClick.bind(this);
    this.showJson = this.showJson.bind(this);
    this.hideJson = this.hideJson.bind(this);
  }

  render() {
    const { season, votingSession, allowClosing, allowJsonViewing, title } = ensure(this.props);
    const { anchorEl, showJson, showVotingResults } = this.state;

    const isVotingSessionClosed = votingSession.status === VotingSessionStatus.COMPLETE;
    const allowToggleVotingResults = isVotingSessionClosed;
    const showMenu = allowJsonViewing || allowClosing || allowToggleVotingResults;

    return (
      <div>
        <Paper className='c-season-info' elevation={1}>
          <div className='c-season-info__header o-action-title'>
            <Typography variant='headline' component='h3'>
              {title}
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
                  {allowClosing ? <MenuItem onClick={this.handleCloseSeasonClick}>Close Season</MenuItem> : null}
                  {allowJsonViewing ? <MenuItem onClick={showJson ? this.hideJson : this.showJson}>{showJson ? 'Hide Json' : 'Show JSON'}</MenuItem> : null}
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
                points={showVotingResults ? pointsForBookFromVoting(season.book, votingSession) : undefined}
                borderless={true}
              />
            </div>
            : null}
          {showVotingResults && isVotingSessionClosed ?
            <div className='c-season-info__voting-results'>
              {voteResultsList(this.props.books, votingSession.results, season.book).map((book, i) =>
                <VoteResultCard
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
    this.setState({ anchorEl: event.currentTarget, closeSeasonDialogOpen: false });
  };

  handleMenuClose() {
    this.setState({ anchorEl: null });
  };

  handleDialogClose() {
    this.setState({
      closeSeasonDialogOpen: false,
    });
  }

  handleCloseSeasonClick() {
    this.setState({
      closeSeasonDialogOpen: true,
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
}