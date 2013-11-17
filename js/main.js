(function(window, $){

	var 
	$doc = $(document),
	$body = $('body'),
	$win = $(window),
	classes = window.classes,
	teachers = window.teachers,
	mode,
	ROUTE_HOME = 1,
	ROUTE_STUDIO = 2,
	ROUTE_TEACHER = 3,
	ROUTE_PLACE = 4,
	ROUTE_CLASS = 5;

	function init() {
		switch_mode();
	}

	function switch_mode() {
		var path = window.location.pathname;
		if (mode) {
			$body.removeClass('mode-'+mode);
		}
		if (!path || path === '/') {
			mode = ROUTE_HOME;
		} 
		// Studio
		else if (/\/s\//.test(path)) {
			mode = ROUTE_STUDIO;
		}
		// Teacher
		else if (/\/t\//.test(path)) {
			mode = ROUTE_TEACHER;

		}
		// Place
		else if (/\/p\//.test(path)) {
			mode = ROUTE_PLACE;

		}
		// Class
		else if (/\/c\//.test(path)) {
			mode = ROUTE_CLASS;
		}
		$body.addClass('mode-'+mode);
		$('.slider').slider();

		load_classes(classes);
	}

	function load_classes (classes) {
		var classList = $('.class-list').empty();
		var html = '', teacher;
		$.each(classes, function(){
			teacher = teachers[this.teacher];
			html += ''
			+'<li class="class-li" data-id="'+this.i+'">'
			+	'<div class="class-left">'
			+		'<div class="class-icon" style="background-image:url('+teacher.img+')"></div>'
			+		'<div class="class-sub">'+teacher.name+'</div>'
			+	'</div>'
			+	'<div class="class-right">'
			+		'<h3>'+this.title+'</h3>'
			+		'<div class="class-rating" data-rating="'+((Math.random()*2)+3)+'"><div class="class-rating-i"></div></div>'
			+		'<button type="button" class="btn btn-primary btn-class-details">See Class Details</button>'
			+	'</div>'
			+	'<div class="class-date">'
			+		'<div class="class-day">'+this.day+'</div>'
			+		'<div class="class-time">'+this.time+'</div>'
			+	'</div>'
			+'</li>';
		});
		classList.html(html);
		classList.find('.class-rating').each(ratings);
	}

	function filterData () {
		var results = [];
		$.each(classes, function(i){
			this.id = i;
			if (Math.random()*10 < (new Date()).getTime() % 10) {
				results.push(this);
			}
		});
		load_classes(results);
	}

	$doc.on('filter', window.debounce(function(){
		filterData();
	}, 200));

	function ratings() {
		var 
		$this = $(this),
		rating = $this.data('rating'),
		bar = $this.find('.class-rating-i');
		bar.css('width', (100*rating/5)+'%');
	}

	$win.resize(function(){
		var 
		$panes = $('.pane'),
		top = $panes.first().offset().top;

		$panes.css('height', $win.height() - top);
	}).resize();

	init();

})(window, jQuery);