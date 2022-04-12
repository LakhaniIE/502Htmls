

$(".descriptionarea").summernote({
    tabsize: 2,
    callbacks: {
        onImageUpload: function(files, editor, $editable) {
            sendFile(files[0], editor, $editable);
        }
    }
  });  
    $(function() {
      var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;		
        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
      }
      Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
          $this = $(this),
          $next = $this.next();		
        $next.slideToggle();
        $this.parent().toggleClass('open');		
        if (!e.data.multiple) {
          $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
      }
      var accordion = new Accordion($('#accordion'), false);
    });
  
  var accordionButtons = $('.accordion-controls li .card');
    {
      $('.accordion-controls li .card').on('click', function(e) {
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


    var accordionButtons = $('.policymemo-inneraccordion-controls li .card');
    function PMToggle(){
      $('.policymemo-inneraccordion-controls li .card').on('click', function(e) {
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


  /*Knowledge Graph*/
   
  $("#anchorEditFolderNamepolicy").click(function(){
    $('#divcontentkbedit').toggle();   
    $('.divkbdescription').hide();        
   }); 
   $('#divcontentkbedit').click(function(e) {
     if ($(e.target).is('#divcontentkbeditcancel')) {
         $('#divcontentkbedit').hide();
        
     }
   });

  /*Q and A*/
   
  $("#addqaedit").click(function(){
    $('#divcontentqaEdit').toggle();   
    $('.divkbdescription').hide();        
   }); 
   $('#divcontentqaEdit').click(function(e) {
     if ($(e.target).is('#divcontentqaeditcancel')) {
         $('#divcontentqaEdit').hide();
        
     }
   });


  /*User Groups*/
  $("#anchoraddremove").click(function(){
    $('#anchoraddremovepopup').toggle();   
         
   }); 
   $('#anchoraddremovepopup').click(function(e) {
     if ($(e.target).is('#anchorRemoveUserbtnclose')) {
         $('#anchoraddremovepopup').hide();
        
     }
   
     
   });

  
  $(document).ready(function() {
    $("#menu li a").on('click', function(e) {
        e.preventDefault()
  
       var parent =  $(this).parent().parent();
       $(parent).find("li a").removeClass("active");
       $(this).addClass("active");
  
        var page = $(this).data('page');
        $("#pages .page:not('.hidecomponent')").stop().fadeOut('fast', function() {
            $(this).addClass('hidecomponent');
            $('#pages .page[data-page="'+page+'"]').show().removeClass('hidecomponent');
            
        });
    });
  
  });