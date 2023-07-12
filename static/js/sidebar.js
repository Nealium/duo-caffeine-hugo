document.addEventListener("DOMContentLoaded", function(event) {
  toggle_button =  document.getElementById("sidebar_toggle_button");

   document
    .getElementById("sidebar_toggle_button")
    .addEventListener("click", function() {
      extras = document.getElementById("sidebar_extras");
      if (extras.style.display === "block") {
        extras.style.display = "none";
      } else {
        extras.style.display = "block";
      }
    });
});
