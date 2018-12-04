import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TurnsToSpeak = new Mongo.Collection('turns_to_speak');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('turns_to_speak', function turnsToSpeakPublication() {
    return TurnsToSpeak.find();
  });
}

Meteor.methods({
  'turns_to_speak.insert'() {
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let usrName = Meteor.users.findOne(this.userId).username;
    if(!usrName) usrName = Meteor.users.findOne(this.userId).profile.name;
    TurnsToSpeak.insert({
      createdAt: new Date(),
      owner: this.userId,
      username: usrName,
    });
  },

  'turns_to_speak.remove'(turnId) {
    check(turnId, String);
    const turn = TurnsToSpeak.findOne(turnId);
    if (turn.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    TurnsToSpeak.remove(turnId);
  },
});
