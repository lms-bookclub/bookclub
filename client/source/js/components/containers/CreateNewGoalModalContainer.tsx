import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import { ReduxActions } from 'actions/ReduxActions';
import { SeasonActions, SeasonActionTypes } from 'actions/SeasonActions';
import { BasicModalWrapper } from 'components/containers/BasicModalWrapper';

export class CreateNewGoalModalContainer_ extends React.Component<any, any> {
  modal;

  constructor(props) {
    super(props);

    this.state = {
      chapter: '',
    };
  }

  render() {
    const chapters: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
      <BasicModalWrapper
        onRef={(ref) => (this.modal = ref)}
        onClose={this.onClose.bind(this)}
        renderTrigger={(modal) => this.props.isAdmin ? <Button onClick={modal.openModal}>Create New Goal</Button> : null}
        renderBody={(modal) => {
          return (
            <div>
              <Typography variant='title' id='modal-title'>
                Create a new goal
              </Typography>
              <Typography variant='body2'>
                Pick which chapter to target
              </Typography>
              <FormControl className='o-field o-field--dropdown'>
                <InputLabel htmlFor='new-goal-chapter'>Chapter</InputLabel>
                <Select
                  value={this.state.chapter}
                  onChange={this.handleChange.bind(this)}
                  inputProps={{
                    name: 'chapter',
                    id: 'new-goal-chapter',
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {chapters.map((chapterNumber, i) => <MenuItem key={i} value={chapterNumber}>{chapterNumber}</MenuItem>)}
                </Select>
              </FormControl>
              <div>
                <Button type='reset' variant='contained' color='primary' onClick={modal.closeModal}>Cancel</Button>
                <Button disabled={!this.state.chapter} type='submit' variant='contained' color='secondary' onClick={this.props.createNewGoal.bind(this)}>Create New Chapter</Button>
              </div>
            </div>
          )
        }}
      />
    );
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onClose() {
    this.setState({
      book: '',
    });
  }
}

const mapStateToProps = (state: any) => {
  return {
    isAdmin: state.users.isAdmin,
    currentSeason: state.seasons[state.seasons.currentId] || {},
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createNewGoal() {
      const seasonId = this.props.currentSeason._id;
      const chapter = {
        number: parseInt(this.state.chapter),
        title: `Chapter ${this.state.chapter}`,
      };
      dispatch(ReduxActions.onNext(SeasonActionTypes.GOT_GOAL_CREATE, () => {
        this.modal.closeModal();
      }));
      dispatch(SeasonActions.createNewGoal(seasonId, chapter));
    },
  }
};

export const CreateNewGoalModalContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateNewGoalModalContainer_));