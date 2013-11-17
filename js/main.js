(function(window, $){

	var 
	$doc = $(document),
	$body = $('body'),
	$win = $(window),
	classes = window.classes,
	arg = '',
	ROUTE_HOME = 1,
	ROUTE_STUDIO = 2,
	ROUTE_TEACHER = 3,
	ROUTE_PLACE = 4,
	ROUTE_CLASS = 5,
	mode = ROUTE_HOME;

	function init() {
		if (!window.location.hash) {
			window.location.hash = '#s/Divinitree';
		}
		switch_mode();
	}

	function switch_mode() {
		var path = window.location.hash;
		arg = path.split('/');
		if (arg.length > 1) {
			arg = arg[1].replace('-',' ');
		}
		if (mode) {
			$body.removeClass('mode-'+mode);
		}
		if (!path || path === '/') {
			mode = ROUTE_HOME;
		} 
		// Studio
		else if (/s\//.test(path)) {
			mode = ROUTE_STUDIO;
			$('.studio-img').css('backgroundImage', 'url(img/'+arg+'.jpg)');
			$('.studio-head h2').text(arg);
			filterData();
		}
		// Teacher
		else if (/t\//.test(path)) {
			mode = ROUTE_TEACHER;
			var cls = classes[+arg];
			var img = cls.teacher_image ? 'img/t/'+cls.teacher_image : 'img/divinitree.jpg';
			$('.studio-img').css('backgroundImage', 'url('+img+')');
			$('.studio-head h2').text(cls.teacher_name);
			filterData();
		}
		// Place
		else if (/p\//.test(path)) {
			mode = ROUTE_PLACE;
			filterData();
		}
		// Class
		else if (/c\//.test(path)) {
			mode = ROUTE_CLASS;
		}
		$('.class-wrap').scrollTop(0);
		$body.addClass('mode-'+mode);
		$('.slider').slider();
	}

	function load_classes (classes) {
		var classList = $('.class-list').empty();
		var html = '',image;
		$.each(classes, function(i){
			image = this.teacher_image ? 'img/t/'+this.teacher_image : 'img/divinitree.jpg';
			html += ''
			+'<li class="class-li" data-id="'+this.class_id+'">'
			+	'<div class="class-left">'
			+		'<div class="class-icon" style="background-image:url('+image+')"></div>'
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
			if (arg) {
				if (mode === ROUTE_STUDIO && this.studio_name !== arg) {
					return;
				}
				if (mode === ROUTE_TEACHER && this.teacher_name !== classes[+arg].teacher_name) {
					return;
				}
			}
			results.push(this);
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

		window.location.hash = '#c/'+id+'/'+nice_name;
		switch_mode();
	});

	$doc.on('click', '.class-left', function(e){
		var 
		$this = $(this).closest('.class-li'),
		id = +$this.data('id'),
		cls = classes[id];

		var nice_name = cls.teacher_name.replace(/[^a-zA-Z0-9\-]+/g,'-');

		e.stopPropagation();
		window.location.hash = '#t/'+id+'/'+nice_name;
		switch_mode();
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

	window.onhashchange = switch_mode;

	init();

	setTimeout(function(){
		$('.content-inner').addClass('t10');
	},200);

})(window, jQuery);