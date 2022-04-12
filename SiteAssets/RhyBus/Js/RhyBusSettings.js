//Settings Page Navigation//
$("#divaccordian a").click(function() {
    var link = $(this);
    var closest_ul = link.closest("ul");
    var parallel_active_links = closest_ul.find(".active")
    var closest_li = link.closest("li");
    var link_status = closest_li.hasClass("active");
    var count = 0;
  
    closest_ul.find("ul").slideUp(function() {
        if (++count == closest_ul.find("ul").length)
            parallel_active_links.removeClass("active");
    });
  
    if (!link_status) {
        closest_li.children("ul").slideDown();
        closest_li.addClass("active");
    }
  });
  //All Buttons Popups Show/hide//
  $(".anchorsettingglobalbtn").click(function(f){
    $(".divsettingglobalpopup").hide();
    var globalclassname = this.closest('div.divsettingsheader').nextElementSibling.id;
    $('#'+ globalclassname).show();
    if ($('#'+ globalclassname).hasClass('divpopupopened')) {
      $('#'+ globalclassname).hide().removeClass('divpopupopened');
    } else {
      $('.divsettingglobalpopup').removeClass('divpopupopened');
      $('#'+ globalclassname).show().addClass('divpopupopened');
    }
  });
  $('.anchorglobalcancelbtn').click(function() {
    $(".divsettingglobalpopup").hide().removeClass('divpopupopened');
  });
  //All Edit Popups Show/hide//
  $('.anchorglobalcardedit').click(function() {
    $('.divcardeditpopup').show();
  });
  $('.anchoreditcanel').click(function() {
    $('.divcardeditpopup').hide();
  });
  //Policymemo Edit Popups Show/hide//
  $('.anchorpolicycardedit').click(function() {
    $('.divcardpolicyeditpopup').show();
  });
  $('.anchorpolicyeditcanel').click(function() {
    $('.divcardpolicyeditpopup').hide();
  });
  
  //Settings Accordians//
  var accordionButtons = $('.ulaccordians li .divaccordiancard');
  function accordionToggle() {
  $('.ulaccordians li .divaccordiancard').on('click', function(e) {
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
  
  
  $(document).ready(function(){
  
    
    $('.ulSettingsLeftNavbar a').click(function(event) {
      event.preventDefault();
      
      // Toggle active class on tab buttons
      $(this).parent().addClass("current");
      $(this).parent().siblings().removeClass("current");
      
      // display only active tab content
      var activeTab = $(this).attr("href");
      $('.tabcontent ').not(activeTab).css("display","none");
      $(activeTab).fadeIn();
      
    });
    
    });
  
  
    $(document).ready(function () {
      $("#kbDescription,#editkbDescription,#QuestionDescription,#AnswerDescription").summernote({
        height: 300, // set editor height		
        minHeight: null, // set minimum height of editor		
        maxHeight: null, // set maximum height of editor		
        focus: false, // set focus to editable area after initializing summernote		
      });
       //Customizing positions from our side because of distortion issue
       $(".dropdown-menu").find(".note-palette").each(function () {
        var tempElement = $(this).find(".note-palette")[0];
        $(this).after(tempElement);
        $(this).find(".note-palette").remove();
      });
    });
   