var systemModel= function() {
  var self= this;

  self.prompt= ko.observable('\\U:\\d mysql>');
  self.cmd= ko.observable('');

  self.user= ko.observable('');
  self.password= ko.observable('');
  self.database= ko.observable('');
  self.host= ko.observable('localhost');

  self.results= ko.observableArray();

  self.displayprompt= ko.computed(function() {
    var prompt= self.prompt().replace(/\\h/g, self.host())
                             .replace(/\\u/g, self.user() || '(none)')
                             .replace(/\\d/g, self.database() || '(none)')
                             .replace(/\\U/g,
                                      self.user() + '@' + self.host());
    return prompt;
  }, this);

  self.run= function(form) {
    var cmd= this.cmd();
    var space= cmd.indexOf(' ');
    if (space < 0)
      space= cmd.length;

    switch (cmd.substring(0, space)) {
    case 'connect':
      var space2= cmd.indexOf(' ', space + 1);
      if (space2 < 0) space2= cmd.length;
      this.user(cmd.substring(space + 1, space2));
      if (space != space2)
        this.password(cmd.substring(space2 + 1));
      break;

    case 'prompt':
      var prompt= cmd.substring(space + 1);
      if (!prompt) prompt= "mysql>";
      this.prompt(prompt);
      break;

    case 'use':
      var database= cmd.substring(space + 1);
      this.database(database);
      break;

    default:
      $.getJSON("db.php?callback=?",
                { user: this.user(),
                  password: this.password(),
                  database: this.database(),
                  cmd: this.cmd() },
                self.addResult);
    }
  };

  self.addResult= function(data) {
    self.results.push(data);
    $("html, body").animate({
      scrollTop: $(document).height() - $(window).height()
    });
  };
};

ko.applyBindings(new systemModel());

$.getFocusedElement = function() {
  var elem = document.activeElement;
  return $( elem && ( elem.type || elem.href ) ? elem : [] );
};

$(function() {
  $(document).keydown(function(ev) {
    if (ev.keyCode == 16 || ev.keyCode == 17
        || ev.keyCode == 18 || ev.keyCode == 91
        || ev.metaKey || ev.altKey || ev.ctrlKey) {
      return true;
    }
    var el = $.getFocusedElement();
    if (!el.length) {
      var inp= $('.autofocus', this);
      inp.focus();
    }
  });
});
