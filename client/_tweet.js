Template.tweet.helpers({
  tweetedTime: function() {
    return moment(this.tweetedAt).fromNow();
  },
  tweetText: function() {
    if (this.linkedText) {
      return this.linkedText;
    } else {
      return this.text;
    }
  } 
});
