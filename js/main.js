(function(window, $){

	var $doc = $(document);

	function ready() {
		$('.slider').slider();
	}

	$.fn.slider = function () {

		function slider () {
			var 
			$this = $(this),
			$bg = $this.find('.slider-bg'),
			$inner = $this.find('.slider-i');

			// No double-slider
			if ($this.data('omza-slider')) {
				return;
			}
			$this.data('omza-slider', 1);

			function sliderUpdate(pct) {
				pct = Math.max(0, Math.min(pct, 100));
				$inner.css('width', pct+'%');
				$inner.data('pct', pct);
			}

			function slideMousemove(e) {
				var width = $bg.width();
				var left = $inner.offset().left;
				var fill = e.pageX - left;
				sliderUpdate(fill*100/width);
				e.stopPropagation();
			}

			$bg.on('mousedown', function() {
				$this.on('mousemove', slideMousemove);
			}).on('mouseup', function() {
				$this.off('mousemove', slideMousemove);
			}).on('click', slideMousemove);

			$doc.on('click', function () {
				$this.off('mousemove', slideMousemove);
			});

			var initial = $this.data('pct') !== undefined ? (+$this.data('pct')) : 50;
			sliderUpdate(initial);

			return this;
		}

		this.each(slider);
	};

	ready();

})(window, jQuery);