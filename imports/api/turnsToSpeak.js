import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TurnsToSpeak = new Mongo.Collection('turns_to_speak');
export const Admins = new Mongo.Collection('admins');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('turns_to_speak', () => {
    return TurnsToSpeak.find({});
  });
  Meteor.publish('admins', () => {
    return Admins.find({});
  });
  Meteor.publish('user_list', function (){
    return Meteor.users.find({});
  });
}

Meteor.methods({
  'turns_to_speak.insert'(userId) {
    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    //verify that user is administrator if he wants to insert a turn for other user
    const user_is_admin = Admins.findOne({userId:this.userId});
    if((this.userId != userId) && !user_is_admin){
      throw new Meteor.Error('not-authorized');
    }

    let usrName = Meteor.users.findOne(userId).username;
    if(!usrName) usrName = Meteor.users.findOne(userId).profile.name;
    TurnsToSpeak.insert({
      createdAt: new Date(),
      owner: userId,
      username: usrName,
    });
  },

  'turns_to_speak.remove'(turnId) {
    check(turnId, String);
    const turn = TurnsToSpeak.findOne(turnId);
    const user_is_admin = Admins.findOne({userId:this.userId});
    if ((turn.owner !== this.userId) && !user_is_admin) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    TurnsToSpeak.remove(turnId);
  },
});
