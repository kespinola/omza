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

			function sliderUpdate(e) {
				var left = $inner.offset().left;
				var fill = e.pageX - left;
				$inner.css('width', fill);
				e.stopPropagation();
			}

			$bg.on('mousedown', function() {
				$this.on('mousemove', sliderUpdate);
			}).on('mouseup', function() {
				$this.off('mousemove', sliderUpdate);
			}).on('click', sliderUpdate);

			$doc.on('click', function () {
				$this.off('mousemove', sliderUpdate);
			});

			return this;
		}

		this.each(slider);
	};

	$(ready);

})(window, jQuery);