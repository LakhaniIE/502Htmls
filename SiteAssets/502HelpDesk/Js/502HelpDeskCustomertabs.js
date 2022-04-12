//Calendar tabs//
$(document).ready(function() {
  var panel = new Tabpanel("divcustomertabs");
    
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
 
 