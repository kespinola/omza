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
			$('.studio-img').css('backgroundImage', 'url(img/'+arg.toLowerCase()+'.jpg)');
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
			var c = classes[+arg];
			load_class(c);
		}
		else {
			filterData();
		}
		$('.class-wrap').scrollTop(0);
		$body.addClass('mode-'+mode);
		$('.js-slider').slider();
	}

	function slider_html (val, type, label) {
		return ''
		+'<div class="js-slider slider nosel slider-'+type+'">'
		+	'<div class="slider-img"></div>'
		+	'<div class="slider-bg">'
		+		'<div class="slider-l">'+label+'</div>'
		+		'<div class="slider-i">'
		+			'<div class="slider-l">'+label+'</div>'
		+		'</div>'
		+	'</div>'
		+'</div>';
	}

	function load_classes (classes) {
		var classList = $('.class-list').empty();
		var html = '',image;
		$.each(classes, function(i){
			image = this.teacher_image ? 'img/t/'+this.teacher_image : 'img/divinitree.jpg';
			html += ''
			+'<li class="class-li hook-class" data-id="'+this.class_id+'">'
			+	'<div class="class-left hook-teacher" data-id="'+this.class_id+'">'
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

	function detail_opt(val, sub) {
		return val ? '<div class="detail-opt">' + val + '<span>' + sub + '</span></div>' : '';
	}

	function load_class(c) {
		var $detail = $('.detail').empty();
		var image = this.teacher_image ? 'img/t/'+this.teacher_image : 'img/divinitree.jpg';
		var html = ''
		+'<h1 class="detail-title">'+c.class_name+'</h1>'
		+'<div class="detail-wrap">'
		+'<div class="detail-left">'
		+	slider_html(0.5, 'strength', 'Strength')
		+	slider_html(0.5, 'spirit', 'Spirtuality')
		+	slider_html(0.5, 'flex', 'Flexibility')
		+	slider_html(0.5, 'balance', 'Balance')
		+	slider_html(0.5, 'tempo', 'Tempo')
		+'</div>'
		+'<div class="detail-right">'
		+	'<div class="detail-teacher">'
		+		detail_opt(c.teacher_name, 'Teacher')
		+		'<div class="detail-icon" style="background-image:url('+image+')"></div>'
		+	'</div>'
		+	detail_opt(c.class_day, 'Day')
		+	detail_opt(c.class_time, 'Time')
		+	detail_opt(c.room_name, 'Room')
		+'</div>'
		+'<div class="detail-reg">'
		+	'<button type="button" class="btn btn-primary btn-detail-reg btn-large t02">'
		+		'<span class="glyphicon glyphicon-ok t02"></span>Register for class'
		+	'</button>'
		+'</div>'
		+'</div>';
		$detail.html(html);
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

	$doc.on('click', '.hook-class', function(){
		var 
		$this = $(this),
		id = +$this.data('id'),
		cls = classes[id];

		var nice_name = cls.class_name.replace(/[^a-zA-Z0-9\-]+/g,'-');

		window.location.hash = '#c/'+id+'/'+nice_name;
		switch_mode();
	});

	$doc.on('click', '.hook-teacher', function(e){
		var 
		$this = $(this),
		id = +$this.data('id'),
		cls = classes[id];

		var nice_name = cls.teacher_name.replace(/[^a-zA-Z0-9\-]+/g,'-');

		e.stopPropagation();
		window.location.hash = '#t/'+id+'/'+nice_name;
		switch_mode();
	});

	$doc.on('click', '.btn-detail-reg', function () {
		$(this).toggleClass('btn-primary btn-success');
	});

	$doc.on('click', '.subhead-i', function () {
		window.history.back();
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