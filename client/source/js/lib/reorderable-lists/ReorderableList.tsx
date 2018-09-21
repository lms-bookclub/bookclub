import * as React from 'react';
import { Link } from 'react-router';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import List from '@material-ui/core/List';
import ReorderableListItem from './ReorderableListItem';

class ReorderableList extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      items: props.children
    };

    this.handleOnClick = this.handleOnClick.bind(this);
    this.moveListItem = this.moveListItem.bind(this);
  }

  handleOnClick(itemKey) {
    if (this.props.onClick) {
      this.props.onClick(itemKey);
    }
  }

  moveListItem(dragIndex, hoverIndex) {
    const { items } = this.state;
    const dragItem = items[dragIndex];

    this.setState(
      update(this.state, {
        items: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragItem]],
        },
      }),
    );

    if (this.props.onUpdate) {
      this.props.onUpdate(this.state.items);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.children,
    });
  }

  render() {
    const { items } = this.state;

    return (
      <div>
        <List>
          {items.map((item, i) => (
            <ReorderableListItem
              key={item.key}
              handleOnClick={() => this.handleOnClick(item.key)}
              index={i}
              id={item.key}
              moveListItem={this.moveListItem}
            >
              {item}
            </ReorderableListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(ReorderableList);