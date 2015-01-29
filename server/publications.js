Meteor.publish('tweets', function() {
  return Tweets.find();
});

Meteor.publish('profile', function(username) {
  return Meteor.users.find({username: username}, {fields: {emails: 0, services: 0}});
});
