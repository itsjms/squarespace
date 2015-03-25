Y.use( 'node', 'event-flick', function( Y ) {
  Y.on('domready', function() {

    textShrink('#site-title-wrapper .page-title a', '#site-title-wrapper');
    textShrink('#page-title-wrapper .page-title');

    if (Y.one('#page-header-wrapper').getStyle('backgroundImage') != 'none') {
      Y.one('body').addClass('has-default-bg-image');
    }

    if (Y.UA.mobile) {
      Y.one(window).on('orientationchange', loadAllImages);
    } else {
      var timeout;

      Y.one(window).on('resize', function () {
        timeout && timeout.cancel();
        timeout = Y.later(300, this, loadAllImages);
      });
    }

    function loadAllImages () {
      Y.all('img[data-src]').each(function (img) {
        ImageLoader.load(img);
      });
    }

    var logo = Y.one('.banner-content-site-title-logo-tagline #banner-area-wrapper #banner'),
        logoParent = Y.one('.banner-content-site-title-logo-tagline #banner-area-wrapper #banner-wrapper');
    if (logo) {

      function logoResize() {
        if (logo.get('clientWidth') > logoParent.get('clientWidth')) {
          logo.setStyles({
            'maxHeight' : logo.getComputedStyle('height'),
            'height' : 'auto',
            'width' : '100%'
          });
        }
      }

      Y.one(window).on('resize', function() {
        logo.setAttribute('style', '');
        logoResize();
      });
      logoResize();
    }

    // mobile navigation
    var nav = Y.one('#mobile-navigation');
    if (nav) {
      Y.on('click', function(e) {
        nav.toggleClass('sqs-mobile-nav-open');
        Y.one('body').toggleClass('sqs-mobile-nav-open');
      }, '#mobile-navigation');
    }

    // position shopping cart
    if (Y.one('body.top-navigation-alignment-right') && Y.config.win.innerWidth > 640) {
      Y.later(500, this, function() {
        var shoppingCart = Y.one('.absolute-cart-box'),
            topNavHeight = Y.one('#navigation-top').height();
        if (shoppingCart && topNavHeight) {
          shoppingCart.setStyle('top', topNavHeight + 'px');
        }
      });
    }

    // ensure body is at least as long as the sidebar
    function setPageHeight() {
      if (Y.one('body').get('winWidth') <= 1024 && Y.one('body').get('winWidth') > 768 && Y.one('#sidebar-wrapper')) {
        var combinedSidebars = parseInt(Y.one('.split-sidebars #sidebar-wrapper').getComputedStyle('height'), 10);
        Y.one('#content-wrapper').setStyle('minHeight', combinedSidebars);
      } else if (Y.one('body').get('winWidth') > 1024) {
        var sidebarHeights = [];
        if (Y.one('#sidebar-one-wrapper')) {
          sidebarHeights.push(parseInt(Y.one('#sidebar-one-wrapper').getComputedStyle('height')));
        }
        if (Y.one('#sidebar-two-wrapper')) {
          sidebarHeights.push(parseInt(Y.one('#sidebar-two-wrapper').getComputedStyle('height')));
        }
        if (sidebarHeights.length) {
          Y.one('#content-wrapper').setStyle('minHeight', Math.max(sidebarHeights[0], sidebarHeights[1]));
        }
      }

    }
    setPageHeight();
    Y.one('window').on('resize', setPageHeight);


    // make taps work like clicks
    function tap (anchor) {
      if (!anchor) {
        return false;
      }
      if(Y.UA.touchEnabled){
        anchor.on('flick', function (e) {
          var href = anchor.getAttribute('href');
          if (Math.abs(e.flick.distance) < 15) {
            if(href && href != '#'){
              if(anchor.getAttribute('target') == '_blank'){
                window.open(href);
              } else {
                window.location = href;
              }
            }
          }
        }, {}, this);
      }

    };

    // shrink on blog and event titles in list view
    function textShrink (element, ancestor) {
      if(Y.one(element) && Y.one(element).ancestor(ancestor)){
        Y.all(element).each(function(item){
          item.plug(Y.Squarespace.TextShrink, {
            parentEl: item.ancestor(ancestor)
          });
        });
      }
    };
    
    Y.all('.subnav a, #sidebar-one-wrapper a').each(function(a) {
      tap(a);
    });

    Y.all('.sqs-search-ui-button-wrapper').each(function (search) {
      search.on('flick', function (e) {
        if (Math.abs(e.flick.distance) < 15) {
          search.simulate('click');
        }
      }, {}, this);
    }, this);

  });
});
