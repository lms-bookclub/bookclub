import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ListItem from '@material-ui/core/ListItem'

const style = {
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.key,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = (findDOMNode(component) as any).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveListItem(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const withDropTarget = DropTarget('listItem', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}));

const withDropSource = DragSource('listItem', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}));

class ReorderableListItem extends React.Component<any, any> {
  // static propTypes = {
    // connectDragSource: PropTypes.func.isRequired,
    // connectDropTarget: PropTypes.func.isRequired,
    // handleOnClick: PropTypes.func.isRequired,
    // index: PropTypes.number.isRequired,
    // isDragging: PropTypes.bool.isRequired,
    // id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    // text: PropTypes.string.isRequired,
    // moveListItem: PropTypes.func.isRequired,
  // };

  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      // props for onClick selection
      handleOnClick,
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(
      connectDropTarget(
        <div style={{...style, opacity}}>
          <ListItem onClick={handleOnClick}>{this.props.children}</ListItem>
        </div>)
    );
  }
}

export default withDropTarget(withDropSource(ReorderableListItem));