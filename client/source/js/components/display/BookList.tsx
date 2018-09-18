import * as React from 'react';
import { map } from 'utils/react';
import { BookCard } from 'components/display/BookCard';

const STATUS_VALS = {
  READING: 3,
  SUGGESTED: 2,
  BACKLOG: 1,
  FINISHED: 0,
};

function sortByStatus(a, b) {
  const bookA = a.props.book;
  const bookB = b.props.book;
  return STATUS_VALS[bookB.status] - STATUS_VALS[bookA.status] || bookA.title.localeCompare(bookB.title);
}

export class BookList extends React.Component<any, any> {
  render() {
    return (
      <ul>
        {map(this.props.books, (book, id) =>
          <BookCard
            isAdmin={this.props.isAdmin}
            myId={this.props.myId}
            key={id}
            book={book}
            onEdit={this.props.onItemEdit}
            onDelete={this.props.onItemDelete}
            onPropose={this.props.onItemPropose}
            onRetract={this.props.onItemRetract}
          />
        ).sort(sortByStatus)}
      </ul>
    );
  }
}