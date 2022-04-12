//Textarea Editor//
$(".descriptionarea").summernote({
    tabsize: 2,
    callbacks: {
        onImageUpload: function(files, editor, $editable) {
            sendFile(files[0], editor, $editable);
        }
    }
});
//Summer Note Color Palette//
$(".dropdown-menu").find(".note-palette").each(function () {
    var tempElement = $(this).find(".note-palette")[0];
    $(this).after(tempElement);
    $(this).find(".note-palette").remove();
  });