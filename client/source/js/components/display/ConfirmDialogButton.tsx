import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { PropTypes } from '@material-ui/core';

export interface ConfirmDialogButtonProps {
  onOpen?: Function;
  onCancel?: Function;
  onConfirm?: Function;
  color?: string | PropTypes.Color;
  title: string;
  content: any;
  confirmText?: string;
  confirmColor?: string | PropTypes.Color;
  cancelText?: string;
  cancelColor?: string | PropTypes.Color;
  onRef?: Function;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  isConfirmDisabled?: boolean;
}

export class ConfirmDialogButton extends React.Component<ConfirmDialogButtonProps, any> {
  static defaultProps = {
    closeOnCancel: true,
    closeOnConfirm: true,
  };

  state = {
    open: false,
  };

  openDialog = () => {
    this.setState({ open: true });
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  handleCancel = () => {
    if (this.props.closeOnCancel) {
      this.closeDialog();
    }
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  handleConfirm = () => {
    if (this.props.closeOnConfirm) {
      this.closeDialog();
    }
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  };

  render() {
    const {
      confirmText,
      cancelText,
      content,
      title,
      isConfirmDisabled,
    } = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      isConfirmDisabled: false,
      ...this.props
    };

    const confirmColor: PropTypes.Color = (this.props.confirmColor || 'primary') as PropTypes.Color;
    const cancelColor: PropTypes.Color = (this.props.cancelColor || 'primary') as PropTypes.Color;
    const color: PropTypes.Color = (this.props.color || 'primary') as PropTypes.Color;

    return (
      <div>
        <Button onClick={this.openDialog} color={color}>{this.props.children}</Button>
        <Dialog
          open={this.state.open}
          onClose={this.closeDialog}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
          <DialogContent>
            {content}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color={cancelColor} disabled={isConfirmDisabled}>
              {cancelText}
            </Button>
            <Button onClick={this.handleConfirm} color={confirmColor} autoFocus>
              {confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
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