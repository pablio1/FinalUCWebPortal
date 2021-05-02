document.addEventListener('DOMContentLoaded', () => {

	// Temporary Use only 
	/************  Use on click instead of on hover to activate the dropdown menu item ****************/ 
	const $navDropdown = Array.prototype.slice.call(document.querySelectorAll('.has-dropdown'), 0);	
	if ($navDropdown.length > 0) {
		$navDropdown.forEach( el => {	
			el.addEventListener('click', (e) => {							
				e.stopPropagation();
				el.classList.toggle('is-active');					
			});
      });
	}	
});

