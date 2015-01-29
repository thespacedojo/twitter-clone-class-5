Template.profile.events({
  'click .follow-me': function(event, template) {
    Meteor.call('follow', template.data.user._id);
  },
  'click .unfollow-me': function(event, template) {
    Meteor.call('unfollow', template.data.user._id);
  }
});

Template.profile.helpers({
  following: function() {
    return _(Meteor.user().profile.followingIds).contains(this.user._id);
  },
  tweets: function() {
    return Tweets.find({userId: this.user._id}, {sort: {tweetedAt: -1}});
  }
});
