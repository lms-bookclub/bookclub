import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Book } from 'types';
import { ConfirmDialogButton } from 'components/display/ConfirmDialogButton';
import { pointString } from 'utils/strings';

function bookText(book) {
  return book ? `${book.title} - ${book.author}` : '?? - ??';
}

function setBookProp(props) {
  return (props.results && props.results[0] && props.results[0].book && props.results[0].book._id) || '';
}

export interface CloseWeightedVotingDialogButtonProps {
  onRef?: Function;
  onConfirm: Function;
  books: { [key:string]: Book };
  votes: any[];
  results: any[];
}

export class CloseWeightedVotingDialogButton extends React.Component<CloseWeightedVotingDialogButtonProps, any> {
  dialog: ConfirmDialogButton;

  state = {
    book: '',
  };

  render() {
    const { results, books } = this.props;
    const { book } = this.state;
    const bookList: any[] = Object.values(books);

    return (
      <ConfirmDialogButton
        title='Close Voting?'
        content={
          <div className='c-close-voting-dialog'>
            <DialogContentText>Pick which book to open the season with</DialogContentText>
            <FormControl className='o-field o-field--dropdown u-space--bot-large'>
              <InputLabel htmlFor='new-season-book'>Book</InputLabel>
              <Select
                value={book}
                onChange={this.handleChange.bind(this)}
                inputProps={{
                  name: 'book',
                  id: 'new-season-book',
                }}
              >
                {bookList.map((book) => <MenuItem
                  key={book._id}
                  value={book._id}
                >
                  {bookText(book)}
                </MenuItem>)}
              </Select>
            </FormControl>
            <DialogContentText>
              What the people want:
            </DialogContentText>
            <ul className='c-close-voting-dialog__result-list'>
              {results.map((result, i) => <li key={i} className='c-close-voting-dialog__result'>
                <span className='c-close-voting-dialog__result-points'>{pointString(result.points)}</span>
                <span className='c-close-voting-dialog__result-book'>{bookText(result.book)}</span>
              </li>)}
            </ul>
          </div>
        }
        confirmText='Close Voting'
        confirmColor='secondary'
        onRef={(ref) => (this.dialog = ref)}
        onConfirm={this.handleConfirm.bind(this)}
        onCancel={this.closeDialog.bind(this)}
        color='secondary'
        closeOnConfirm={false}
      >
        Close Voting
      </ConfirmDialogButton>
    );
  }

  closeDialog() {
    this.setState({
      book: setBookProp(this.props),
    });
    this.dialog.closeDialog();
  }

  handleConfirm() {
    this.props.onConfirm(this.state.book);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  componentDidMount() {
    if(this.props.onRef) {
      this.props.onRef(this);
    }
  }

  componentWillUnmount() {
    if(this.props.onRef) {
      this.props.onRef(undefined);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      book: setBookProp(props),
    });
  }
}