Template.tweetStream.events({
  "submit form": function(event, template) {
    event.preventDefault();
    tweet = template.$('.tweet-text').val();
    Tweets.insert({text: tweet}, function(){
      template.$('.tweet-text').val(null);
    });
  }
});
