
$('.view').mousedown(function (event) {
  if (event.which == 2 || event.which == 1) {
    var material_id = $(this).attr('data-id');
    var a = this;
    $.post('/requests/follow', { material_id: material_id }, function (data) {
      var materials = $(a).closest('#materials');
      materials.find('#material-status').html("Просмотрено");
      materials.find('#material-date').html(data.date_viwed);
    });
  }
});
