Router.configure({
  layoutTemplate: 'base',
  loadingTemplate: 'loading'
});

Router.map(function() {
  this.route('tweetStream', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('tweets');
    }
  });
  this.route('notifications', {
    path: '/notifications',
    name: 'notification',
    waitOn: function() {
      return Meteor.subscribe('notifications');
    }
  });
  this.route('profile', {
    path: '/:username',
    name: 'profile',
    waitOn: function() {
      return [
        Meteor.subscribe('profile', this.params.username),
        Meteor.subscribe('profileTweets', this.params.username)
      ];
    },
    data: function() {
      return {
        user: Meteor.users.findOne({username: this.params.username})
      };
    }
  });

  this.route('profileEdit', {
    path: '/profile/edit',
    data: function() {
      return Meteor.user();
    }
  });
});
