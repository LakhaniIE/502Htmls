//Knowledge Graph and Q&A//
$(document).ready(function() {
    var panel = new Tabpanel("divknowqatabs");
    var panel = new Tabpanel("divcalendartabs");
    var panel = new Tabpanel("divlistviewtabs");
    var panel2 = new Tabpanel2("divallquestionstabs");
});
  
  function Tabpanel(id) {
    this._id = id;
    this.$tpanel = $('#' + id);
    this.$tabs = this.$tpanel.find('.tab');
    this.$panels = this.$tpanel.find('.divtabpane');
    this.bindHandlers();
    this.init();
  }
  
  Tabpanel.prototype.keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  
  Tabpanel.prototype.init = function() {
    var $tab;
    this.$panels.attr('aria-hidden', 'true');
    this.$panels.removeClass('active in');
    $tab = this.$tabs.filter('.active');
  
    if ($tab === undefined) {
        $tab = this.$tabs.first();
        $tab.addClass('active');
    }
  
    this.$tpanel
        .find('#' + $tab.find('a').attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');
  }
  
  Tabpanel.prototype.switchTabs = function($curTab, $newTab) {
    var $curTabLink = $curTab.find('a'),
        $newTabLink = $newTab.find('a');
  
    $curTab.removeClass('active');
    $curTabLink.attr('tabindex', '-1').attr('aria-selected', 'false');
  
    $newTab.addClass('active');
    $newTabLink.attr('aria-selected', 'true');
  
    this.$tpanel
        .find('#' + $curTabLink.attr('aria-controls'))
        .removeClass('active in').attr('aria-hidden', 'true');
  
    this.$tpanel
        .find('#' + $newTabLink.attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');
  
    $newTabLink.attr('tabindex', '0');
    $newTabLink.focus();
  }
  
  Tabpanel.prototype.bindHandlers = function() {
    var self = this;
    this.$tabs.keydown(function(e) {
        return self.handleTabKeyDown($(this), e);
    });
  
    this.$tabs.click(function(e) {
        return self.handleTabClick($(this), e);
    });
  }
  
  Tabpanel.prototype.handleTabKeyDown = function($tab, e) {
    var $newTab, tabIndex;
    switch (e.keyCode) {
        case this.keys.left:
        case this.keys.up: {
  
            tabIndex = this.$tabs.index($tab);
  
            if (tabIndex === 0) {
                $newTab = this.$tabs.last();
            } else {
                $newTab = this.$tabs.eq(tabIndex - 1);
            }
  
            this.switchTabs($tab, $newTab);
  
            e.preventDefault();
            return false;
        }
        case this.keys.right:
        case this.keys.down: {
            tabIndex = this.$tabs.index($tab);
  
            if (tabIndex === this.$tabs.length - 1) {
                $newTab = this.$tabs.first();
            } else {
                $newTab = this.$tabs.eq(tabIndex + 1);
            }
  
            this.switchTabs($tab, $newTab);
            e.preventDefault();
            return false;
        }
    }
  }
  
  Tabpanel.prototype.handleTabClick = function($tab, e) {
    var $oldTab = this.$tpanel.find('.tab.active');
    this.switchTabs($oldTab, $tab);
  }


  function Tabpanel2(id) {
    this._id = id;
    this.$tpanel = $('#' + id);
    this.$tabs = this.$tpanel.find('.liqatab');
    this.$panels = this.$tpanel.find('.divqatabpanel');
    this.bindHandlers();
    this.init();
  }
  
  Tabpanel2.prototype.keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  
  Tabpanel2.prototype.init = function() {
    var $tab;
    this.$panels.attr('aria-hidden', 'true');
    this.$panels.removeClass('active in');
  
    $tab = this.$tabs.filter('.active');
    if ($tab === undefined) {
        $tab = this.$tabs.first();
        $tab.addClass('active');
    }
  
    this.$tpanel
        .find('#' + $tab.find('a').attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');
  }
  
  Tabpanel2.prototype.switchTabs = function($curTab, $newTab) {
    var $curTabLink = $curTab.find('a'),
        $newTabLink = $newTab.find('a');
  
    $curTab.removeClass('active');
    $curTabLink.attr('tabindex', '-1').attr('aria-selected', 'false');
  
    $newTab.addClass('active');
    $newTabLink.attr('aria-selected', 'true');
    this.$tpanel
        .find('#' + $curTabLink.attr('aria-controls'))
        .removeClass('active in').attr('aria-hidden', 'true');
  
    this.$tpanel
        .find('#' + $newTabLink.attr('aria-controls'))
        .addClass('active in').attr('aria-hidden', 'false');
  
    $newTabLink.attr('tabindex', '0');
    $newTabLink.focus();
    //toPopulateDropDownValues();
  }
  
  Tabpanel2.prototype.bindHandlers = function() {
    var self = this;
    this.$tabs.keydown(function(e) {
        return self.handleTabKeyDown($(this), e);
    });
  
    this.$tabs.click(function(e) {
        return self.handleTabClick($(this), e);
    });
  }
  
  Tabpanel2.prototype.handleTabKeyDown = function($tab, e) {
    var $newTab, tabIndex;
    switch (e.keyCode) {
        case this.keys.left:
        case this.keys.up: {
  
            tabIndex = this.$tabs.index($tab);
  
            if (tabIndex === 0) {
                $newTab = this.$tabs.last();
            } else {
                $newTab = this.$tabs.eq(tabIndex - 1);
            }
            this.switchTabs($tab, $newTab);
            e.preventDefault();
            return false;
        }
        case this.keys.right:
        case this.keys.down: {
  
            tabIndex = this.$tabs.index($tab);
  
            if (tabIndex === this.$tabs.length - 1) {
                $newTab = this.$tabs.first();
            } else {
                $newTab = this.$tabs.eq(tabIndex + 1);
            }
  
            this.switchTabs($tab, $newTab);
            e.preventDefault();
            return false;
        }
    }
  }
  
  Tabpanel2.prototype.handleTabClick = function($tab, e) {
    var $oldTab = this.$tpanel.find('.liqatab.active');
    this.switchTabs($oldTab, $tab);
  }

//Notifications Custom Tabs//
$(function(){
    var index = 0;
    var $tabs = $('a.tab');
    $tabs.bind(
    {
     
      keydown: function(ev){
        var LEFT_ARROW = 37;
        var UP_ARROW = 38;
        var RIGHT_ARROW = 39;
        var DOWN_ARROW = 40;
  
        var k = ev.which || ev.keyCode;
        if (k >= LEFT_ARROW && k <= DOWN_ARROW){        
          if (k == LEFT_ARROW || k == UP_ARROW){
            if (index > 0) {
              index--;
            }
            else {
              index = $tabs.length - 1;
            }
          }        
          else if (k == RIGHT_ARROW || k == DOWN_ARROW){
            if (index < ($tabs.length - 1)){
              index++;
            }
            else {
              index = 0;
            }
          }
          $($tabs.get(index)).click();
          ev.preventDefault();
        }
      },
      click: function(ev){
        index = $.inArray(this, $tabs.get());
        setFocus();
        ev.preventDefault();
      }
    });
  
    var setFocus = function(){
      $tabs.attr(
      {
        tabindex: '-1',
        'aria-selected': 'false'
      }).removeClass('selected');
      $('.tab-panel').removeClass('current');
      $($tabs.get(index)).attr(
      {
        tabindex: '0',
        'aria-selected': 'true'
      }).addClass('selected').focus();
      $($tabs.get(index)).parent().siblings().removeClass('current');
      $($tabs.get(index)).parent().addClass('current');
      $($($tabs.get(index)).attr('href')).addClass('current');
    };
  });
  
  
  $(function(){
    var index = 0;
    var $tabs = $('a.notification-tab');
    $tabs.bind(
    {
     
      keydown: function(ev){
        var LEFT_ARROW = 37;
        var UP_ARROW = 38;
        var RIGHT_ARROW = 39;
        var DOWN_ARROW = 40;
  
        var k = ev.which || ev.keyCode;
        if (k >= LEFT_ARROW && k <= DOWN_ARROW){        
          if (k == LEFT_ARROW || k == UP_ARROW){
            if (index > 0) {
              index--;
            }
            else {
              index = $tabs.length - 1;
            }
          }        
          else if (k == RIGHT_ARROW || k == DOWN_ARROW){
            if (index < ($tabs.length - 1)){
              index++;
            }
            else {
              index = 0;
            }
          }
          $($tabs.get(index)).click();
          ev.preventDefault();
        }
      },
      click: function(ev){
        index = $.inArray(this, $tabs.get());
        setFocus();
        ev.preventDefault();
      }
    });
  
    var setFocus = function(){
      $tabs.attr(
      {
        tabindex: '-1',
        'aria-selected': 'false'
      }).removeClass('selected');
      $('.notification-panel').removeClass('current');
      $($tabs.get(index)).attr(
      {
        tabindex: '0',
        'aria-selected': 'true'
      }).addClass('selected').focus();
      $($tabs.get(index)).parent().siblings().removeClass('current');
      $($tabs.get(index)).parent().addClass('current');
      $($($tabs.get(index)).attr('href')).addClass('current');
    };
  });

  $(document).ready(function () {
    $("#InputMultiDescription, #InputMultiEditDescription, #InputMultiAddAnswerEditDescription, #InputMultiAddAnswerEditDescriptionCustom").summernote({
      height: 300, // set editor height		
      minHeight: null, // set minimum height of editor		
      maxHeight: null, // set maximum height of editor		
      focus: false, // set focus to editable area after initializing summernote		
    });
  });
  