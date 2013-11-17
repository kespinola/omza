(function(window, $){

	var 
	$doc = $(document),
	$body = $('body'),
	$win = $(window),
	classes = window.classes,
	ROUTE_HOME = 1,
	ROUTE_STUDIO = 2,
	ROUTE_TEACHER = 3,
	ROUTE_PLACE = 4,
	ROUTE_CLASS = 5,
	mode = ROUTE_HOME;

	function init() {
		var path = window.location.pathname;
		if (!path || path === '/') {
			window.history.pushState({}, 'Divinitree | Omza', '/s/Divinitree');
		}
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
		var html = '';
		$.each(classes, function(i){
			html += ''
			+'<li class="class-li" data-id="'+this.class_id+'">'
			+	'<div class="class-left">'
			+		'<div class="class-icon" style="background-image:url('+(this.teacher_img || 'img/divinitree.jpg')+')"></div>'
			+		'<div class="class-sub">'+this.teacher_name+'</div>'
			+	'</div>'
			+	'<div class="class-right">'
			+		'<h3>'+this.class_name+'</h3>'
			+		'<div class="class-rating" data-rating="'+((Math.random()*2)+3)+'"><div class="class-rating-i"></div></div>'
			+		'<button type="button" class="btn btn-primary btn-class-details">See Class Details</button>'
			+	'</div>'
			+	'<div class="class-date">'
			+		'<div class="class-day">'+this.class_day+'</div>'
			+		'<div class="class-time">'+this.class_time+'</div>'
			+	'</div>'
			+'</li>';
			if (i >= 35) {
				return false;
			}
		});
		classList.html(html);
		classList.find('.class-rating').each(ratings);
	}

	function filterData () {
		var results = [];
		$.each(classes, function(i){
			this.class_id = i;
			if (Math.random()*10 < (new Date()).getTime() % 10) {
				results.push(this);
			}
		});
		load_classes(results);
	}

	$doc.on('filter', window.debounce(function(){
		filterData();
	}, 200));

	$doc.on('click', '.home-search-btn', function(){
		$body.addClass('mode-2');
	});

	$doc.on('click', '.class-li', function(){
		var 
		$this = $(this),
		id = +$this.data('id'),
		cls = classes[id];

		var nice_name = cls.class_name.replace(/[^a-zA-Z0-9\-]+/g,'-');

		window.history.pushState(
			{}, 
			cls.class_name + ' | ' + cls.studio + ' | ' + 'Omza', 
			'/c/'+id+'/'+nice_name
		);
	});

	function ratings() {
		var 
		$this = $(this),
		rating = $this.data('rating'),
		bar = $this.find('.class-rating-i');
		bar.css('width', (100*rating/5)+'%');
	}

	$win.resize(function(){
		var 
		$panes = $('.pane, .sub-pane'),
		top = $panes.first().offset().top;

		$panes.css('height', $win.height() - top);
	}).resize();

	init();

	setTimeout(function(){
		$('.content-inner').addClass('t10');
	},200);

})(window, jQuery);