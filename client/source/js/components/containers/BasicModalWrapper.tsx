import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Modal from '@material-ui/core/Modal';

export class BasicModalWrapper_ extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: this.props.isOpen || false,
    };

    this.openModal = this.props.openModal || this.openModal.bind(this);
    this.closeModal = this.props.closeModal || this.closeModal.bind(this);
  }

  render() {
    return (
      <div>
        {this.props.renderTrigger ? this.props.renderTrigger(this) : null}

        <Modal
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'
          open={this.state.isModalOpen}
          onClose={this.closeModal}
        >
          <div className='o-dialog'>
            {this.props.renderBody(this)}
          </div>
        </Modal>
      </div>
    );
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
    if(this.props.opOpen) {
      this.props.opOpen();
    }
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
    if(this.props.onClose) {
      this.props.onClose();
    }
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

const mapStateToProps = (state: any) => {
  return {
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
};

export const BasicModalWrapper = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(BasicModalWrapper_));