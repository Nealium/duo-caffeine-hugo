document.addEventListener('DOMContentLoaded', function(event) {
  document
    .getElementById('sidebar_toggle_button')
    .addEventListener('click', function() {
      extras = document.getElementById('sidebar_extras');
      if (extras.style.display === 'block') {
        extras.style.display = 'none';
      } else {
        extras.style.display = 'block';
      }
    });

  let search_label_list = document.getElementsByClassName('search_label');
  for (let i = 0; i < search_label_list.length; i++) {
    search_label_list[i].addEventListener('click', function() {
      target = document.getElementById(this.getAttribute('for'));
      target.focus();
    });
  };

  let clear_search_list = document.getElementsByClassName('clear_search');
  for (let i = 0; i < clear_search_list.length; i++) {
    clear_search_list[i].addEventListener('click', function() {
      target = document.getElementById(this.getAttribute('for'));
      target.value = '';
    });
  };
});
