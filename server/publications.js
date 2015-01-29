Meteor.publish('tweets', function() {
  return Tweets.find();
});

Meteor.publish('profile', function(username) {
  return Meteor.users.find({username: username}, {fields: {emails: 0, services: 0}});
});

Meteor.publish('profileTweets', function(username) {
  var user = Meteor.users.findOne({username: username});
  return Tweets.find({userId: user._id});
});
