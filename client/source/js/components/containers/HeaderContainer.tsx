import * as React from 'react';
import { Router, Route, Switch, browserHistory, withRouter } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavTab } from 'components/display/NavTab';
import { User } from 'types';

class HeaderContainer_ extends React.Component<any, any> {
  state = {
    anchorEl: null,
  };

  constructor(props) {
    super(props);

    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
  }

  render() {
    const { anchorEl } = this.state;
    const { users } = this.props;
    const { myId } = users;
    const me: User = myId ? users.users[myId] : null;

    return (
      <header className='c-header'>
        <ul className='c-header__nav-tabs'>
          <NavTab to='/'>Voting</NavTab>
          <NavTab to='/books'>Books</NavTab>
          <NavTab to='/seasons'>Previous Seasons</NavTab>
        </ul>
        <div>
          {me
            ? (<div onClick={this.handleMenuOpen}>
                {me.avatar ? <img className='o-avatar' src={me.avatar} /> : <span>{me.name}</span>}
              </div>
              )
            : <Button color='primary' href='/auth/google'>Sign in with Google</Button>
          }
          {me ? <Menu
            id='login-menu'
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={this.handleSignout}>Sign Out</MenuItem>
          </Menu> : null}
        </div>
      </header>
    );
  }

  handleMenuOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  handleSignout() {
    this.handleMenuClose();
    window.location.href = '/auth/logout';
  }
}

const mapStateToProps = (state: any) => {
  return {
    users: state.users || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  }
};

export const HeaderContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderContainer_));