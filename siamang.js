var systemModel= function() {
  var self= this;

  self.prompt= ko.observable('mysql>');
  self.cmd= ko.observable('');

  self.results= ko.observableArray();

  self.run= function(form) {
    $.getJSON("db.php?callback=?",
              { cmd: this.cmd() },
              self.addResult);
  };

  self.addResult= function(data) {
    self.results.push(data);
    $("html, body").animate({
      scrollTop: $(document).height() - $(window).height()
    });
  };
};

ko.applyBindings(new systemModel());
