import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

export class GenericModalContainer_ extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.openModal = this.props.openModal || this.openModal.bind(this);
    this.closeModal = this.props.closeModal || this.closeModal.bind(this);
  }

  // TODO: actually contain a modal here. currently the child still does the heavy lifting
  render() {
    const Component = this.props.modalComponent;
    const componentProps = this.props.modalProps;
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isModalOpen;

    return (
      <div>
        {this.props.renderTrigger(this)}
        <Component
          open={isOpen}
          handleClose={this.closeModal}
          onSubmit={this.props.onSubmit}
          {...componentProps}
        />
      </div>
    );
  }

  openModal() {
    this.setState({
      isModalOpen: true,
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
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

export const GenericModalContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(GenericModalContainer_));