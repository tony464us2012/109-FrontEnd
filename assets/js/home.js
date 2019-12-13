    
        (function($) {
        
        
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#mainnav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;
    
    // Nav Panel.

		// Toggle.
        $navPanelToggle = $(
            '<a href="#navPanel" id="navPanelToggle">Menu</a>'
        )
            .appendTo($wrapper);

        // Change toggle styling once we've scrolled past the header.
            $header.scrollex({
                bottom: '5vh',
                enter: function() {
                    $navPanelToggle.removeClass('alt');
                },
                leave: function() {
                    $navPanelToggle.addClass('alt');
                }
            });

    // Panel.
        $navPanel = $(
            '<div id="navPanel">' +
                '<nav>' +
                '</nav>' +
                '<a href="#navPanel" class="close"></a>' +
            '</div>'
        )
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'right',
                target: $body,
                visibleClass: 'is-navPanel-visible'
            });

        // Get inner.
            $navPanelInner = $navPanel.children('nav');

        // Move nav content on breakpoint change.
            var $navContent = $nav.children();

            breakpoints.on('>medium', function() {

                // NavPanel -> Nav.
                    $navContent.appendTo($nav);

                // Flip icon classes.
                    $nav.find('.icons, .icon')
                        .removeClass('alt');

            });

            breakpoints.on('<=medium', function() {

                // Nav -> NavPanel.
                    $navContent.appendTo($navPanelInner);

                // Flip icon classes.
                    $navPanelInner.find('.icons, .icon')
                        .addClass('alt');

            });

        // Hack: Disable transitions on WP.
            if (browser.os == 'wp'
            &&	browser.osVersion < 10)
                $navPanel
                    .css('transition', 'none');

                    
})(jQuery);
