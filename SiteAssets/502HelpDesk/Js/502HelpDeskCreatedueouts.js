$(document).ready(function () {
    $("#InputtextDueDate, #InputtextDueDateicon").datepicker({
       minDate: 0,
     });
     $("#InputtextDueDateicon").click(function () {
       $("#InputtextDueDate").focus();
     });
   
     $("#InputtextRnltd, #InputtextRnltdicon").datepicker({
         minDate: 0,
       });
       $("#InputtextRnltdicon").click(function () {
         $("#InputtextRnltd").focus();
       });
 
       $("#InputtextPDD, #InputtextPDDicon").datepicker({
         minDate: 0,
       });
       $("#InputtextPDDicon").click(function () {
         $("#InputtextPDD").focus();
       });
 
       $("#InputtextDOS, #InputtextDOSicon").datepicker({
         minDate: 0,
       });
       $("#InputtextDOSicon").click(function () {
         $("#InputtextDOS").focus();
       });
   
   });
   