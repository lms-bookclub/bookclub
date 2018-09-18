import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { debounce } from '@shared/utils/functions';
import { Book } from 'types';
import ActionClient from 'clients/ActionClient';

export interface EditBookDialogProps {
  handleClose: (event?) => void;
  onSubmit: (formState) => void;
  open: boolean;
  classes?: any;
  book?: Book;
}

const defaultImageSrc = '/icons/icon-book-256.png';

const fieldState = (defaults = {}) => (Object.assign({
  value: '',
  dirty: false,
  error: null,
  required: true,
}, defaults));

const getFormState = ({ book } = { book: null }) => {
  const state = {
    title: fieldState(),
    author: fieldState(),
    goodreads: fieldState(),
    genre: fieldState({ required: false }),
    image: fieldState({ required: false }),
    pitch: fieldState({ required: false }),
    submittable: false,
    loading: false,
  };

  if (book) {
    state.title.value = book.title || '';
    state.author.value = book.author || '';
    state.goodreads.value = book.links.goodreads || '';
    state.image.value = book.links.image || '';
    state.genre.value = book.genre || '';
    state.pitch.value = book.pitch || '';
    state.submittable = true;
  }
  return state;
};

function validate(formState) {
  const isUrlRegExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  formState.submittable = true;

  const requiredFields = [
    'title',
    'author',
    'goodreads',
  ];

  requiredFields.forEach(_ => {
    if(!formState[_].value) {
      formState.submittable = false;
      if(formState[_].dirty) {
        formState[_].error = `Field is required`;
      }
    }
  });

  if(formState.goodreads.value && !isUrlRegExp.test(formState.goodreads.value)) {
    formState.goodreads.error = 'Invalid Goodreads URL';
    formState.submittable = false;
  }

  return formState;
}

// TODO: look into using redux-form and breaking the modal out
export class EditBookDialog extends React.Component<EditBookDialogProps, any> {
  debouncedFetchDetailsAndUpdateState: Function;

  constructor(props) {
    super(props);
    this.state = validate(getFormState({ book: props.book }));

    this.debouncedFetchDetailsAndUpdateState = debounce(this.fetchDetailsAndUpdateState.bind(this), 500);
  }

  render() {
    return (
      <Dialog
        className='c-edit-book-dialog'
        aria-labelledby='edit-book-dialog-title'
        open={this.props.open}
        onClose={this.handleCancel.bind(this)}
      >
        <DialogTitle id='edit-book-dialog-title'>
          {this.props.book ? 'Edit book' : 'Add a book'}
          <div className='o-spinner-anchor'>
            {this.state.loading ? <div className='o-spinner'/> : null}
          </div>
        </DialogTitle>
        <DialogContent className='c-edit-book-dialog__content'>
          <div className='u-flex u-flex--row u-space--bot-large'>
            <div className='u-flex--col'>
              <TextField
                id='goodreads'
                label='Goodreanks Link **'
                className='o-field o-field--text'
                value={this.state.goodreads.value}
                onChange={this.handleChange('goodreads')}
                margin='normal'
                type='url'
                error={!!this.state.goodreads.error}
              />
              <TextField
                id='image'
                label='Cover Image URL'
                className='o-field o-field--text'
                value={this.state.image.value}
                onChange={this.handleChange('image')}
                margin='normal'
                error={!!this.state.image.error}
              />
              <div className='c-edit-book-dialog__cover-image-container'>
                <img className='c-edit-book-dialog__cover-image' src={this.state.image.value || defaultImageSrc} />
              </div>
            </div>
            <div className='u-flex--col'>
              <TextField
                id='title'
                label='Title *'
                className='o-field o-field--text'
                value={this.state.title.value}
                onChange={this.handleChange('title')}
                margin='normal'
                error={!!this.state.title.error}
              />
              <TextField
                id='author'
                label='Author *'
                className='o-field o-field--text'
                value={this.state.author.value}
                onChange={this.handleChange('author')}
                margin='normal'
                error={!!this.state.author.error}
              />
              <TextField
                id='genre'
                label='Genre'
                className='o-field o-field--text'
                value={this.state.genre.value}
                onChange={this.handleChange('genre')}
                margin='normal'
                error={!!this.state.genre.error}
              />
              <TextField
                id='pitch'
                label='Pitch'
                placeholder="Describe your book and why it's interesting"
                multiline
                rows='3'
                className='o-field o-field--text'
                value={this.state.pitch.value}
                onChange={this.handleChange('pitch')}
                margin='normal'
                error={!!this.state.pitch.error}
              />
            </div>
          </div>
          <DialogContentText>
            * Required
          </DialogContentText>
          <DialogContentText>
            ** Entering a Goodreads link will attempt to auto-complete any empty fields.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type='reset' color='primary' onClick={this.handleCancel.bind(this)}>Cancel</Button>
          <Button disabled={!this.state.submittable} type='submit' color='primary' onClick={this.handleSubmit.bind(this)}>{this.props.book ? 'Save book' : 'Add book'}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit({
      title: this.state.title.value,
      author: this.state.author.value,
      goodreads: this.state.goodreads.value,
      pitch: this.state.pitch.value,
      image: this.state.image.value,
      genre: this.state.genre.value,
    });
    this.setState({
      ...getFormState(),
    });
  }

  handleChange = name => event => {
    let formState = {
      ...this.state,
      [name]: {
        value: event.target.value,
        dirty: true,
      },
    };

    formState = validate(formState);

    this.setState(formState);

    if(name === 'goodreads') {
      this.debouncedFetchDetailsAndUpdateState(event.target.value);
    }
  };

  handleCancel() {
    this.props.handleClose();
    this.setState({
      ...getFormState(),
    });
  }

  fetchDetailsAndUpdateState(url) {
    this.setState({
      loading: true,
    });
    ActionClient.findBookDetails(url)
      .then(details => {
        const stateDelta = {};
        for(const key in details) {
          const value = details[key];
          const hasValue = !!this.state[key].value;
          if(!hasValue) {
            stateDelta[key] = {
              value,
              dirty: true,
            };
          }
        }
        if(Object.keys(stateDelta).length > 0) {
          let formState = {
            ...this.state,
            ...stateDelta,
            loading: false,
          };

          formState = validate(formState);

          this.setState(formState);
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const newState = getFormState({ book: nextProps.book });
    const formState = validate(newState);
    this.setState(formState);
  }
}