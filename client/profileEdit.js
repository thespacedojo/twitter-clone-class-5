Template.profileEdit.events({
  'submit form': function(event, template) {
    event.preventDefault();
    data = SimpleForm.processForm(event.target);
    Users.update(Meteor.userId(), {$set: {profile: data}}, function(err) {
      if (err) {
        CoffeeAlerts.warning("There was an error saving your profile.");
      } else {
        CoffeeAlerts.success("Your profile has been updated.");
        Router.go("/");
      }
    });
  }
});
