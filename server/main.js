import { Meteor } from 'meteor/meteor';

import '../imports/api/turnsToSpeak.js';
Meteor.startup(() => {
// code to run on server at startup
});

Accounts.validateNewUser(function(user){
  if(!user.services.google) return true;
  if(user.services.google.email.match(/creativa77\.com\.ar$/)) {
      return true;
  }
  throw new Meteor.Error(403, "You must sign in using a creativa77.com.ar account");
});
