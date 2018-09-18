import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Book } from 'types';
import { ConfirmDialogButton } from 'components/display/ConfirmDialogButton';

export interface OpenSeasonDialogButtonProps {
  onRef?: Function;
  onConfirm: Function;
  books: { [key:string]: Book };
}

export class OpenSeasonDialogButton extends React.Component<OpenSeasonDialogButtonProps, any> {
  dialog: ConfirmDialogButton;

  state = {
    book: '',
  };

  render() {
    const books: any[] = Object.values(this.props.books);

    return (
      <ConfirmDialogButton
        title='Close this season?'
        content={
          <div>
            <DialogContentText>Pick which book to open the season with</DialogContentText>
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
                {books.map((book) => <MenuItem key={book._id} value={book._id}>{book.title} - {book.author}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        }
        confirmText='Open New Season'
        onRef={(ref) => (this.dialog = ref)}
        onConfirm={this.handleConfirm.bind(this)}
        onCancel={this.closeDialog.bind(this)}
      >
        Open New Season
      </ConfirmDialogButton>
    );
  }

  closeDialog() {
    this.setState({
      book: '',
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
}