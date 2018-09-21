import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import { ReduxActions } from 'actions/ReduxActions';
import { SeasonActions, SeasonActionTypes } from 'actions/SeasonActions';
import { BasicModalWrapper } from 'components/containers/BasicModalWrapper';

export class OpenSeasonModalContainer_ extends React.Component<any, any> {
  modal;

  constructor(props) {
    super(props);

    this.state = {
      book: '',
    };
  }

  render() {
    const books: any[] = Object.values(this.props.books);

    return (
      <BasicModalWrapper
        onRef={(ref) => (this.modal = ref)}
        onClose={this.onClose.bind(this)}
        renderTrigger={(modal) => this.props.isAdmin ? <Button onClick={modal.openModal}>Open New Season</Button> : null}
        renderBody={(modal) => {
          return (
            <div>
              <Typography variant='title' id='modal-title'>
                Open new season?
              </Typography>
              <Typography variant='body2'>
                Pick which book to open the season with
              </Typography>
              <FormControl className='o-field o-field--dropdown'>
                <InputLabel htmlFor='new-season-book'>Book</InputLabel>
                <Select
                  value={this.state.book}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'book',
                    id: 'new-season-book',
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {books.map((book, i) => <MenuItem key={i} value={book._id}>{book.title} - {book.author}</MenuItem>)}
                </Select>
              </FormControl>
              <div>
                <Button type='reset' variant='contained' color='primary' onClick={modal.closeModal}>Cancel</Button>
                <Button disabled={!this.state.book} type='submit' variant='contained' color='secondary' onClick={this.props.openNewSeason.bind(this)}>Open New Season</Button>
              </div>
            </div>
          )
        }}
      />
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onClose() {
    this.setState({
      book: '',
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    isAdmin: state.users.isAdmin,
    currentSeason: state.seasons[state.seasons.currentId] || {},
    books: state.books,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    openNewSeason() {
      const bookId = this.state.book;
      dispatch(ReduxActions.onNext(SeasonActionTypes.GOT_OPEN, () => {
        this.modal.closeModal();
      }));
      dispatch(SeasonActions.openSeason(/*bookId*/));
    },
  }
};

export const OpenSeasonModalContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenSeasonModalContainer_));