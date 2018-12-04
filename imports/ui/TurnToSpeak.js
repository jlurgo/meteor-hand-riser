import React, { Component } from 'react';
import { TurnsToSpeak } from '../api/turnsToSpeak.js';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Task component - represents a single todo item
export default class TurnToSpeak extends Component {
  deleteThisTurn() {
    Meteor.call('turns_to_speak.remove', this.props.turn._id);
  }

  render() {
    return (
      <li className="turn_to_speak">
        <button className="delete" onClick={this.deleteThisTurn.bind(this)}>
          &times;
        </button>
        <span className="text">
          <strong>{this.props.turn.username}</strong>
        </span>
      </li>
    );
  }
}
