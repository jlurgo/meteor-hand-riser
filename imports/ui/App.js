import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { TurnsToSpeak } from '../api/turnsToSpeak.js';

import TurnToSpeak from './TurnToSpeak.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    Meteor.call('turns_to_speak.insert');
  }

  renderTurns() {
    return this.props.turnsToSpeak.map((turn) => {
      return (
        <TurnToSpeak
          key={turn._id}
          turn={turn}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Speakers Queue ({this.props.turnsCount})</h1>
          <AccountsUIWrapper />
          { (this.props.currentUser && this.props.userDidntRiseHand) ?
            <form className="new-turn" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="submit"
                ref="rise_hand_btn"
                value="rise your hand"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderTurns()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('turns_to_speak');
  let user_id = -1
  if(Meteor.user()) user_id = Meteor.user()._id;
  return {
    turnsToSpeak: TurnsToSpeak.find({}, { sort: { createdAt: 1 } }).fetch(),
    turnsCount: TurnsToSpeak.find({}).count(),
    userDidntRiseHand: TurnsToSpeak.find({owner: user_id}).count()==0,
    currentUser: Meteor.user(),
  };
})(App);
