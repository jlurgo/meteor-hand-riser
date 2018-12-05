import React, { Component } from 'react';
import { TurnsToSpeak, Admins } from '../api/turnsToSpeak.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class TurnToSpeak extends Component {
  deleteThisTurn() {
    Meteor.call('turns_to_speak.remove', this.props.turn._id);
  }

  render() {
    let user_id = Meteor.user() ? Meteor.user()._id : -1;

    return (
      <li className="turn_to_speak">
        <img src= {this.props.userPicture} />
        <span className="text">
          <strong>{this.props.turn.username}</strong>
        </span>
        {
          ((user_id == this.props.turn.owner) || this.props.loggedUserIsAdmin ) ?
          <button className="delete" onClick={this.deleteThisTurn.bind(this)}>
            &times;
          </button>: ''
        }
      </li>
    );
  }
}
