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
  }
});

Template.tweets.events({
  "click .show-new-tweets": function(event, template) {
    Session.set('lastSeenTweets', new Date());
  }
});
