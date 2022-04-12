/////////////////////// - MPF Action Item - /////////////////////////////
var accordionButtons = $('.divMpfactionitems li .divMpfactionitemsheader');
function accordionToggle() {
  $('.divMpfactionitems li .divMpfactionitemsheader').on('click', function (e) {
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
  for (var i = 0; i < accordionButtons.length; i++) {
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


/////////////////////// - MPF Action Item end- /////////////////////////////


/////////////////////// - Check list Details Start- /////////////////////////////
$('.divcheckList').click(function () {
  if ($(this).next().is(':hidden') != true) {
      $(this).removeClass('active');
      $(this).next().slideUp("normal");
  } else {
      $('.divcheckList').removeClass('active');
      $('.divcheckListItems').slideUp('normal');
      if ($(this).next().is(':hidden') == true) {
          $(this).addClass('active');
          $(this).next().slideDown('normal');
      }
  }
});

/////////////////////// - Check list Details End- /////////////////////////////

/////////////////////// - Item Details Start- /////////////////////////////
$('.divItemheaderaction').click(function () {
    if ($(this).next().is(':hidden') != true) {
        $(this).removeClass('active');
        $(this).next().slideUp("normal");
    } else {
        $('.divItemheaderaction').removeClass('active');
        $('.divcontent').slideUp('normal');
        if ($(this).next().is(':hidden') == true) {
            $(this).addClass('active');
            $(this).next().slideDown('normal');
        }
    }
});


$('.expandall').click(function (event) {
    $('.divItemheaderaction').next().slideDown('normal');
    { $('.divItemheaderaction').addClass('active'); }
    $('.collapseall').removeClass('hidecomponent');
    $('.expandall').addClass('hidecomponent');
});

$('.collapseall').click(function (event) {
    $('.divItemheaderaction').next().slideUp('normal');
    { $('.divItemheaderaction').removeClass('active'); }
    $('.collapseall').addClass('hidecomponent');
    $('.expandall').removeClass('hidecomponent');
});


/////////////////////// - Item Details End- /////////////////////////////


/////////////////////// -Files Start- /////////////////////////////
$(document).ready(function () {
	$(function () {
		var Accordion = function (el, multiple) {
			this.el = el || {};
			this.multiple = multiple || false;
			// Variables privadas
			var links = this.el.find('.spanfiles');
			// Evento
			links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
		}
		Accordion.prototype.dropdown = function (e) {
			var $el = e.data.el;
			$this = $(this),
				//$next = $this.next();	
				$next = $this.closest(".divfilesheader").next();
			$next.slideToggle();
			$this.parent().toggleClass('open');
			if (!e.data.multiple) {
				$el.find('.submenu').not($next).slideUp();
				$el.find('.divfilesheader').not($this.closest(".divfilesheader")).removeClass('open');
			};
		}
		var accordion = new Accordion($('#accordion'), true);
	});



});

/////////////////////// - Files  End- /////////////////////////////

$(document).ready(function () {
$('.anchorchecklist').click(function() {
	$(this).toggleClass('opened');
	$('.divchecklists').toggle();
});
});

/////////////////////// - calendar  start- /////////////////////////////

$(document).ready(function () {
  $("#Inputtextdatepicker1, #Dateiconone").datepicker({
     minDate: 0,
   });
   $("#Dateiconone").click(function () {
     $("#Inputtextdatepicker1").focus();
   });
 
   $("#InputTextDueDate, #InputTextDueDateicon").datepicker({
       minDate: 0,
     });
     $("#InputTextDueDateicon").click(function () {
       $("#InputTextDueDate").focus();
     });
 
 });

/////////////////////// - calendar  end- /////////////////////////////