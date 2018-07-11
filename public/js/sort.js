/*
0 = no sort
1 = desc
2 = asc
*/
var sort = {
  dateupload: 2,
  dateviwed: 1,
  status: 2
}

$('#dateupload').on('click', () => {

  if (sort.dateviwed != 0) sort.dateviwed = 0;
  if (sort.dateupload == 2 || sort.dateupload == 0) {
    sort.dateupload = 1;
    $('#dateuploadSort').removeClass().addClass("glyphicon glyphicon-sort-by-attributes")

  } else {
    sort.dateupload = 2;
    $('#dateuploadSort').removeClass().addClass("glyphicon glyphicon-sort-by-attributes-alt")

  }
  getSortData()
});

$('#status').on('click', () => {
  if (sort.status == 2 || sort.status == 0) {
    sort.status = 1;
    $('#statusSort').html("просмотрено")

  } else {
    sort.status = 2;
    $('#statusSort').html("не просмотрено")

  }
  getSortData()

});

$('#dateviwed').on('click', () => {
  $('#dateviwedSort').toggleClass("glyphicon-sort-by-attributes glyphicon-sort-by-attributes-alt")
  $('#dateuploadSort').removeClass().addClass("glyphicon glyphicon-sort")
  if (sort.dateupload != 0) sort.dateupload = 0;
  if (sort.dateviwed == 2 || sort.dateviwed == 0) {
    sort.dateviwed = 1;
    $('#dateviwedSort').removeClass().addClass("glyphicon glyphicon-sort-by-attributes")

  } else {
    sort.dateviwed = 2;

  }
  getSortData()

});

var getSortData = () => {
  $.get('/requests/sort/'+currentPage, sort, (data) => {
    $('tbody').html(data);
  })
}