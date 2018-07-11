var myVid = document.querySelector("video");
var r = new XMLHttpRequest();
r.onload = function() {
    myVid.src = URL.createObjectURL(r.response);
    myVid.play();
};
    r.open("GET", "<%=src%>");

r.responseType = "blob";
r.send();