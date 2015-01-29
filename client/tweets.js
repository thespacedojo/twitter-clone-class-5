Template.tweets.rendered = function() {
  Session.set('lastSeenTweets', new Date());
};

Template.tweets.helpers({
  newTweets: function() {
    return Tweets.find({
      tweetedAt: {
        $gt: Session.get('lastSeenTweets')
      }
    });
  },
  tweets: function() {
    if (this.user) {
      return Tweets.find({
        userId: this.user._id,
        tweetedAt: {
          $lt: Session.get('lastSeenTweets')
        }
      });
    } else {
      return Tweets.find({
        tweetedAt: {
          $lt: Session.get('lastSeenTweets')
        }
      });
    }
  }
});

Template.tweets.events({
  "click .show-new-tweets": function(event, template) {
    Session.set('lastSeenTweets', new Date());
  }
});
