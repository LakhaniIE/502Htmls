//PII//
$(document).ready(function() {
    var panel = new Tabpanel("divlistviewtabs");
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


  //KPI Accordian//

  $(document).ready(function () {
    var panel1 = new Tabpanel("divspendactiontabs");

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

Tabpanel.prototype.init = function () {
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

Tabpanel.prototype.switchTabs = function ($curTab, $newTab) {
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

Tabpanel.prototype.bindHandlers = function () {
    var self = this;
    this.$tabs.keydown(function (e) {
        return self.handleTabKeyDown($(this), e);
    });

    this.$tabs.click(function (e) {
        return self.handleTabClick($(this), e);
    });
}

Tabpanel.prototype.handleTabKeyDown = function ($tab, e) {
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

Tabpanel.prototype.handleTabClick = function ($tab, e) {
    var $oldTab = this.$tpanel.find('.tab.active');
    this.switchTabs($oldTab, $tab);
}


var accordionKPIS = $('.divkpislist li .divSpendactionkpisheader');
function KPIToggle() {
  $('.divkpislist li .divSpendactionkpisheader').on('click', function(e) {
	$control = $(this);

	accordionContent = $control.attr('aria-controls');
	checkOthers($control[0]);

	isAriaExp = $control.attr('aria-expanded');
	newAriaExp = (isAriaExp == "false") ? "true" : "false";
	$control.attr('aria-expanded', newAriaExp);

	isAriaHid = $('#' + accordionContent).attr('aria-hidden');
	if (isAriaHid == "true") {
	  $('#' + accordionContent).attr('aria-hidden', "false");
	  $('#' + accordionContent).css('display', 'block');
	} else {
	  $('#' + accordionContent).attr('aria-hidden', "true");
	  $('#' + accordionContent).css('display', 'none');
	}
  });
};

  var accordionButtons = $('.divaccordioncontrols li a');

function accordionToggle() {
$('.divaccordioncontrols li a').on('click', function(e) {
  $control = $(this);

  accordionContent = $control.attr('aria-controls');
  checkOthers($control[0]);

  isAriaExp = $control.attr('aria-expanded');
  newAriaExp = (isAriaExp == "false") ? "true" : "false";
  $control.attr('aria-expanded', newAriaExp);

  isAriaHid = $('#' + accordionContent).attr('aria-hidden');
  if (isAriaHid == "true") {
    $('#' + accordionContent).attr('aria-hidden', "false");
    $('#' + accordionContent).css('display', 'block');
  } else {
    $('#' + accordionContent).attr('aria-hidden', "true");
    $('#' + accordionContent).css('display', 'none');
  }
});
};

function checkOthers(elem) {
for (var i=0; i<accordionButtons.length; i++) {
  if (accordionButtons[i] != elem) {
    if (($(accordionButtons[i]).attr('aria-expanded')) == 'true') {
      $(accordionButtons[i]).attr('aria-expanded', 'false');
      content = $(accordionButtons[i]).attr('aria-controls');
      $('#' + content).attr('aria-hidden', 'true');
      $('#' + content).css('display', 'none');
    }
  }
}
};


 /////////////////////// - Accordian tab start - /////////////////////////////

 $('#anchorlaunchNewScan').click(function () {
  $(this).toggleClass('opened');
  $('#divScanListShow').slideToggle(250);
});

 $('.divCustomtoggle').click(function () {
    $(this).toggleClass('opened');
    $('.showPIIContent').slideToggle(250);
  });

  $('.divCustomtoggle1').click(function () {
      $(this).toggleClass('opened');
      $('.showPIIContent1').slideToggle(250);
    });

    $('.divCustomtoggle2').click(function () {
      $(this).toggleClass('opened');
      $('.showPIIContent2').slideToggle(250);
    });

    $('.divCustomtoggle3').click(function () {
      $(this).toggleClass('opened');
      $('.showPIIContent3').slideToggle(250);
    });
    
  /////////////////////// -  Accordian tab  end - /////////////////////////////

   /////////////////////// - New Formate button start - /////////////////////////////
 $('#anchorNewformatebtn1').click(function () {
  $(this).toggleClass('opened');
  $('#showPIIContentNewformate1').slideToggle(250);
  });

    $("#piiformatcancelbtn1").click(function() {
      $("#showPIIContentNewformate1").hide();
    });

    $('#anchorNewformatebtn2').click(function () {
      $(this).toggleClass('opened');
      $('#showPIIContentNewformate2').slideToggle(250);
      });
    
      $("#piiformatcancelbtn2").click(function() {
        $("#showPIIContentNewformate2").hide();
      });

      $('#anchorNewformatebtn3').click(function () {
        $(this).toggleClass('opened');
        $('#showPIIContentNewformate3').slideToggle(250);
        });
      
        $("#piiformatcancelbtn3").click(function() {
          $("#showPIIContentNewformate3").hide();
        });

        $('#anchorNewformatebtn4').click(function () {
          $(this).toggleClass('opened');
          $('#showPIIContentNewformate4').slideToggle(250);
          });
        
          $("#piiformatcancelbtn4").click(function() {
            $("#showPIIContentNewformate4").hide();
          });
      
  
/////////////////////// -  New Formate button  end - /////////////////////////////
  
/////////////////////// - Add new category start - /////////////////////////////

$('#anchorAddnewCategory').click(function () {
  $(this).toggleClass('opened');
  $('#divAddnewCategory').slideToggle(250);
  });

  $("#anchorCancelCategory").click(function() {
    $("#divAddnewCategory").hide();
  });

  /////////////////////// - Add new category end - /////////////////////////////

  /////////////////////// - Scan list Details Start- /////////////////////////////
$('.divScanAction').click(function () {
  if ($(this).next().is(':hidden') != true) {
      $(this).removeClass('active');
      $(this).next().slideUp("normal");
  } else {
      $('.divScanAction').removeClass('active');
      $('.divcontent').slideUp('normal');
      if ($(this).next().is(':hidden') == true) {
          $(this).addClass('active');
          $(this).next().slideDown('normal');
      }
  }
});

/////////////////////// - Scan list Details End- /////////////////////////////
