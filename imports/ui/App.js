import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { TurnsToSpeak, Admins } from '../api/turnsToSpeak.js';

import TurnToSpeak from './TurnToSpeak.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import Select from 'react-select';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    Meteor.call('turns_to_speak.insert', this.props.currentUser._id);
  }

  renderTurns() {
    return this.props.turnsToSpeak.map((turn) => {
      let picture = '';
      let usr = Meteor.users.findOne({_id: turn.owner});
      if(usr.services.google)
        picture = usr.services.google.picture;
      return (
        <TurnToSpeak
          key={turn._id}
          turn={turn}
          loggedUserIsAdmin={this.props.loggedUserIsAdmin}
          userPicture={picture}
        />
      );
    });
  }

  render() {
    return (
      <div className="container container-fluid">
        <header>
          <div className= "row">
            <h1 className="col">Speakers Queue ({this.props.turnsCount})</h1>
            <AccountsUIWrapper />
          </div>
          { (this.props.currentUser && this.props.userDidntRiseHand) ?
            <form className="new-turn" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type = "submit"
                ref = "rise_hand_btn"
                value = "rise your hand"
              />
            </form> : ''
          }

          { this.props.loggedUserIsAdmin ?
            <Select
              className = "select_users"
              placeholder = "select an user to add him to the queue"
              value = {null}
              options = {
                Meteor.users.find({
                  _id: {
                      $nin: this.props.turnsToSpeak.map((turn) => {return turn.owner;})
                  }
                })
                .fetch()
                .map((usr)=>{
                  const usrName = usr.username ? usr.username : usr.profile.name;
                  let label = usrName;
                  if(usr.services.google)
                    label = <span className = "user_in_select"> <img src= {usr.services.google.picture}/> <label> {usrName} </label> </span>
                  return {
                    value: usr._id,
                    label: label
                  }
                })
              }
              onChange = {(selectedOption) => {
                Meteor.call('turns_to_speak.insert', selectedOption.value);
              }}
            />: ''
          }
        </header>

        <ul className="list-group list-group-flush">
          {this.renderTurns()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('turns_to_speak');
  Meteor.subscribe('admins');
  Meteor.subscribe('user_list');

  let user_id = -1
  let user_is_admin = false;
  if(Meteor.user()) {
    user_id = Meteor.user()._id;
    user_is_admin = Admins.findOne({userId: Meteor.user()._id})? true : false;
  }

  return {
    turnsToSpeak: TurnsToSpeak.find({}, { sort: { createdAt: 1 } }).fetch(),
    turnsCount: TurnsToSpeak.find({}).count(),
    userDidntRiseHand: TurnsToSpeak.find({owner: user_id}).count()==0,
    currentUser: Meteor.user(),
    loggedUserIsAdmin: user_is_admin
  };
})(App);
