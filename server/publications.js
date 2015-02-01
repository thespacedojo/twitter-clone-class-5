Meteor.publish('tweets', function() {
  var userCursor = Users.find({_id: this.userId});
  var user = userCursor.fetch()[0];
  var cursors = [];
  var ids = [];
  var self = this;
  if (this.userId) {
    ids.push(user.profile.followingIds);
    ids.push(this.userId);
  }
  var followingIds = _.flatten(ids);

  cursors.push(Tweets.find({userId: {$in: followingIds}}));
  cursors.push(Users.find({
    _id: {$in: followingIds}
  }, {
    fields: {username: 1, "profile.name": 1}
  }));

  userCursor.observeChanges({
    changed: function(id, fields) {
      var flatIds = fields.profile.followingIds;
      flatIds.push(self.userId);

      addedFollowingIds = _.difference(flatIds, followingIds);
      removedFollowingIds = _.difference(followingIds, flatIds);

      // Update the followingIds for the next run through this
      followingIds = fields.profile.followingIds;
      followingIds.push(self.userId);

      if (addedFollowingIds) {
        users = Users.find({
          _id: {$in: addedFollowingIds}
        }, {
          fields: {username: 1, "profile.name": 1}
        });

        console.log(users.count());
        
        _.each(users.fetch(), function(user) {
          self.added('users', user._id, user);
          console.log('added - user', user);

          tweets = Tweets.find({userId: user._id});
          console.log('Tweets found: ', tweets.count());

          tweets.forEach(function(tweet) {
            self.added('tweets', tweet._id, tweet);
            console.log('added - tweet', tweet);
          });
        });
      }
      if (removedFollowingIds) {
        users = Users.find({
          _id: {$in: removedFollowingIds}
        }, {
          fields: {username: 1, "profile.name": 1}
        });

        _.each(users.fetch(), function(user) {
          self.removed('users', user._id);
          tweets = Tweets.find({userId: user._id});
          tweets.forEach(function(tweet) {
            self.removed('tweets', tweet._id);
          });
        });
      }
    }
  });

  return cursors;
});

Meteor.publish('notifications', function() {
  tweetsCursor = Tweets.find({mentionIds: {$in: [this.userId]}});
  userIds = _.pluck(tweetsCursor.fetch(), "userId");
  usersCursor = Users.find({_id: {$in: userIds}}, {fields: {username: 1, "profile.name": 1}});
  return [tweetsCursor, usersCursor];
});

Meteor.publish('profile', function(username) {
  return Meteor.users.find({username: username}, {fields: {emails: 0, services: 0}});
});

Meteor.publish('profileTweets', function(username) {
  var user = Meteor.users.findOne({username: username});
  return Tweets.find({userId: user._id});
});

Meteor.publish('usernames', function(selector, options, colName) {
  collection = global[colName];
  self = this;
  console.log(selector);
  console.log(options);
  _.extend(options, {fields: {username: 1}});
  handle = collection.find(selector, options).observeChanges({
    added: function(id, fields) {
      self.added('autocompleteRecords', id, fields);
    },
    changed: function(id, fields) {
      self.changed('autocompleteRecords', id, fields);
    },
    removed: function(id) {
      self.removed('autocompleteRecords', id);
    }
  });
  self.ready();
  self.onStop(function() {handle.stop();});
});
