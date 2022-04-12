var accordionKPIS = $('.divkpislist li .divkpisheader');
function KPIToggle() {
  $('.divkpislist li .divkpisheader').on('click', function(e) {
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
  for (var i=0; i<accordionKPIS.length; i++) {
	if (accordionKPIS[i] != elem) {
	  if (($(accordionKPIS[i]).attr('aria-expanded')) == 'true') {
		$(accordionKPIS[i]).attr('aria-expanded', 'false');
		content = $(accordionKPIS[i]).attr('aria-controls');
		$('#' + content).attr('aria-hidden', 'true');
		$('#' + content).css('display', 'none');
	  }
	}
  }
};