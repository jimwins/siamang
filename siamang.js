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
