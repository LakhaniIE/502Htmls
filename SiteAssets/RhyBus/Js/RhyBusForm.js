$(document).ready(function () {
   $("#Inputtextdatepicker1, #Dateiconone").datepicker({
      minDate: 0,
    });
    $("#Dateiconone").click(function () {
      $("#Inputtextdatepicker1").focus();
    });
  
    $("#Inputtextdatepicker2, #Dateicontwo").datepicker({
        minDate: 0,
      });
      $("#Dateicontwo").click(function () {
        $("#Inputtextdatepicker2").focus();
      });

      $("#Inputtextdatepicker3, #Dateiconthree").datepicker({
        minDate: 0,
      });
      $("#Dateiconthree").click(function () {
        $("#Inputtextdatepicker3").focus();
      });

      $("#Inputtextdatepicker4, #Dateiconfour").datepicker({
        minDate: 0,
      });
      $("#Dateiconfour").click(function () {
        $("#Inputtextdatepicker4").focus();
      });
  
  });
  
  
  $(document).ready(function () {
    $(".descriptionarea").summernote({
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
  /////////////////////// - Instructions start - /////////////////////////////
  $('.anchorInsbtn').click(function () {
    $(this).toggleClass('opened');
    $('.divforminstructions').slideToggle(250);
    });
  

    $("#spancloseicon").click(function() {
        $("#divformsubmitlist").hide();
      });
      
      $("#spanbottomcloseicon").click(function() {
      $("#divbottomformvalidate").hide();
      });
      $('.anchorSubmitbtn').click(function () {
        $(this).toggleClass('opened');
        $('.divformsubmitlist').slideToggle(250);
        $('.divforminstructions').css('display', 'none');
        $('#divformsubmitlistbottom').css('display', 'none');
      
      
      });
      
      $('.anchorsubmitbottom').click(function () {
        $(this).toggleClass('opened');
        $('#divformsubmitlistbottom').slideToggle(250);
        $('.divforminstructions').css('display', 'none');
        $("#divbottomformvalidate").hide();
        
      });

      $("#spanbottomcloseicon").click(function() {
        $("#divformsubmitlistbottom").hide();
      });
    
  /////////////////////// - Instructions end - /////////////////////////////

  
  
  
  /////////////////////// - Dropzone Start - /////////////////////////////
  $(document).on('dragover', function () {
    $(".dropzonecontrol").addClass("insideborder");
  });
  $(document).on('dragleave', function () {
    $(".dropzonecontrol").removeClass("insideborder");
  });
  $(document).on('drop', function () {
    $(".dropzonecontrol").removeClass("insideborder");
  });
  
  /////////////////////// - Dropzone End - /////////////////////////////
  
  
/////////////////////// - SearchIavm start - /////////////////////////////
(function ($) {
  $(function () {
    window.fs_test = $('.searchiavm').fSelect();
  });
})(jQuery);

/////////////////////// - SearchIavm end - /////////////////////////////




/////////////////////// Right side Check List Accordians /////////////////////// 
var accordionButtons = $('.divaccordioncontrols li .anchorheader');

function accordionToggle() {
  $('.divaccordioncontrols li .anchorheader').on('click', function(e) {
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

