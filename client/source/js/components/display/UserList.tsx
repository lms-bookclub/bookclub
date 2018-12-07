import * as React from 'react';
import classnames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { User } from 'types';

export interface UserListProps {
  label: string;
  voters: User[];
  className?: string;
}

export class UserList extends React.Component<UserListProps, any> {
  render() {
    const { label, voters } = this.props;
    const className = classnames('c-user-list', this.props.className);

    return (
      <Paper className={className}>
        <Typography variant='subheading' component='h4'>
          {label}
        </Typography>
        <Typography component='p'>
          {voters.map(_ =>
            _.avatar
              ? <Tooltip title={_.name} placement='bottom'>
                  <img className='o-avatar' src={_.avatar} alt={_.name} />
                </Tooltip>
              : <span>{_.name}</span>
          )}
        </Typography>
      </Paper>
    );
  }
}