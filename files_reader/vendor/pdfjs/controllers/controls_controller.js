PDFJS.reader.ControlsController = function(book) {
    var reader = this,
        settings = reader.settings;

    var $store = $("#store"),
        $viewer = $("#viewer"),
        $fullscreen = $("#fullscreen"),
        $fullscreenicon = $("#fullscreenicon"),
        $cancelfullscreenicon = $("#cancelfullscreenicon"),
        $slider = $("#slider"),
        $main = $("#main"),
        $sidebar = $("#sidebar"),
        $titlebar = $("#titlebar"),
        $settings = $("#setting"),
        $bookmark = $("#bookmark"),
        $note = $("#note"),
        $togglelayout = $("#toggle-layout"),
        $zoom_icon = $("#zoom_icon"),
        $zoom_options = $("#zoom_options"),
        $zoom_option = $(".zoom_option"),
        $rotate_icon = $("#rotate_icon"),
        $rotate_options = $("#rotate_options"),
        $rotate_option = $(".rotate_option"),
        $rotate_left = $("#rotate_left"),
        $rotate_right = $("#rotate_right"),
        $page_num = $("#page_num"),
        $total_pages = $("#total_pages");

    if (reader.isMobile() === true) {
        $titlebar.addClass("background_visible");
    };

    var show = function () {
        $titlebar.removeClass("hide");
    };

    var hide = function () {
        $titlebar.addClass("hide");
    };

    var toggle = function () {
        $titlebar.toggleClass("hide");
    };

    $viewer.on("touchstart", function(e) {
        reader.ControlsController.toggle();
    });

    var fullscreen = false;

    $slider.on("click", function () {
        if(reader.sidebarOpen) {
            reader.SidebarController.hide();
            //$slider.addClass("icon-menu");
            //$slider.removeClass("icon-right2");
        } else {
            reader.SidebarController.show();
            //$slider.addClass("icon-right2");
            //$slider.removeClass("icon-menu");
        }
    });

    if(typeof screenfull !== 'undefined') {
        $fullscreen.on("click", function() {
            screenfull.toggle($('#container')[0]);
        });
        if(screenfull.raw) {
            document.addEventListener(screenfull.raw.fullscreenchange, function() {
                fullscreen = screenfull.isFullscreen;
                if(fullscreen) {
                    $fullscreen
                        .addClass("icon-fullscreen_exit")
                        .removeClass("icon-fullscreen");
                } else {
                    $fullscreen
                        .addClass("icon-fullscreen")
                        .removeClass("icon-fullscreen_exit");
                }
            });
        }
    }

    $settings.on("click", function() {
        reader.SettingsController.show();
    });

    $note.on("click", function() {
        reader.SidebarController.changePanelTo("Notes");
    });

    $bookmark.on("click", function() {
        var cfi = reader.book.getCurrentLocationCfi();

        if(!(reader.isBookmarked(cfi))) { //-- Add bookmark
            reader.addBookmark(cfi);
            $bookmark
                .addClass("icon-turned_in")
                .removeClass("icon-turned_in_not");
        } else { //-- Remove Bookmark
            reader.removeBookmark(cfi);
            $bookmark
                .removeClass("icon-turned_in")
                .addClass("icon-turned_in_not");
        }

    });

    /* select works fine on most browsers, but - of course - apple mobile has 'special needs'
     * in that it does not support any styling in the drop-down list, and as such can not display
     * icons there. Due to the unfortunate fact that many still buy these apple-encumbered devices
     * a custom select is needed...
     *    
    $zoomlevel.val(settings.zoomLevel);

    $zoomlevel.on("change", function () {
        reader.setZoom($(this).val());
        var $option = $zoomlevel.find(":selected");
        if ($option.data("icon") !== undefined)
            $("#zoom_icon")[0].textContent = $option.data("icon");
    });

    *
    */ 

    /* custom select, supports icons in drop-down list */
    // zooooooooooooooom
    $zoom_icon.on("click", function () {
        var offset = $(this).offset();
        console.log(offset);
        $zoom_options.css("opacity", 0);
        $zoom_options.toggleClass("hide");
        $zoom_options.css({
            'left': parseInt(offset.left - ($zoom_options.width() / 2)) + "px",
            'top' : parseInt(parseInt(offset.top) + parseInt($zoom_icon.height())) + "px"
        });

        $zoom_options.css("opacity", "");
    });

    var setZoomIcon = function(zoom) {
        $zoom_icon[0].className="";
        var $current_zoom_option = $zoom_options.find("[data-value='" + zoom + "']");
        if ($current_zoom_option.data("class")) {
            $zoom_icon.addClass($current_zoom_option.data("class"));
        } else {
            $zoom_icon[0].textContent = $current_zoom_option.data("text");
        }
    };

    setZoomIcon(settings.zoomLevel);

    /*
    $zoom_icon[0].className="";
    var $current_zoom_option = $zoom_options.find("[data-value='" + settings.zoomLevel + "']");
    if ($current_zoom_option.data("class")) {
        $zoom_icon.addClass($current_zoom_option.data("class"));
    } else {
        $zoom_icon[0].textContent = $current_zoom_option.data("text");
    }
    */

    $zoom_option.on("click", function () {
        var $this = $(this);
        reader.setZoom($this.data("value"));
        $zoom_icon[0].className="";
        $zoom_icon[0].textContent = "";
        if ($this.data("class")) {
            $zoom_icon.addClass($this.data("class"));
        } else {
            $zoom_icon[0].textContent = $this.data("text");
        }
        $zoom_options.addClass("hide");
    });

    // rotate
    var setRotateIcon = function (rotation) {
        $rotate_icon[0].className = "";
        $rotate_icon[0].className = "icon-rotate_" + rotation;
    };

    setRotateIcon(settings.rotation);

    $rotate_icon.on("click", function () {
        var offset = $(this).offset();
        $rotate_options.css("opacity", 0);
        $rotate_options.toggleClass("hide");
        $rotate_options.css({
            'left': parseInt(offset.left - ($rotate_options.width() / 2)) + "px",
            'top' : parseInt(parseInt(offset.top) + parseInt($rotate_icon.height())) + "px"
        });

        $rotate_options.css("opacity", "");
    });

    $rotate_option.on("click", function () {
        var $this = $(this);
        reader.setRotation($this.data("value"));
        $rotate_icon[0].className="";
        $rotate_icon[0].textContent = "";
        if ($this.data("class")) {
            $rotate_icon.addClass($this.data("class"));
        } else {
            $rotate_icon[0].textContent = $this.data("text");
        }
        $rotate_options.addClass("hide");
    });

    $rotate_left.on("click", function () {
        // add 360 to avoid negative rotation value
        var rotation = (settings.rotation - 90 + 360) % 360;
        reader.setRotation(rotation);
        $rotate_icon[0].className = "";
        $rotate_icon[0].className = "icon-rotate_" + rotation;
    });

    $rotate_right.on("click", function () {
        var rotation = (settings.rotation + 90) % 360;
        reader.setRotation(rotation);
        $rotate_icon[0].className = "";
        $rotate_icon[0].className = "icon-rotate_" + rotation;
    });
    /* end custom select */

    var enterPageNum = function(e) {
        var text = e.target,
            page;

        switch (e.keyCode) {
            case 27: // escape - cancel, discard changes
                $page_num[0].removeEventListener("keydown", enterPageNum, false);
                $page_num.removeClass("editable");
                $page_num.prop("contenteditable",false);
                $page_num.text($page_num.data("content"));
                break;
            case 13: // enter - accept changes
                $page_num[0].removeEventListener("keydown", enterPageNum, false);
                $page_num.removeClass("editable");
                $page_num.attr("contenteditable", false);
                page = parseInt($page_num.text());
                if (page > 0 && page <= reader.settings.numPages) {
                    reader.queuePage(page);
                } else {
                    $page_num.text($page_num.data("content"));
                }
                break;
        }

        e.stopPropagation;
    };


    $page_num.on("click", function() {
        $page_num.data("content", $page_num.text());
        $page_num.text("");
        $page_num.prop("contenteditable", true);
        $page_num.addClass("editable");
        $page_num[0].addEventListener("keydown", enterPageNum, false);
    });

    var setPageCount = function (_numPages) {

        var numPages = _numPages || reader.settings.numPages;

        $total_pages[0].textContent = parseInt(numPages).toString();
    };

    var setCurrentPage = function (_page) {

        var page = _page || reader.settings.currentPage,
            zoom = reader.settings.zoomLevel,
            oddPageRight = reader.settings.oddPageRight,
            total_pages = reader.settings.numPages,
            text;

        if (zoom === "spread") {
             if (oddPageRight === true) {
                 page -= page % 2;
             } else {
                 page -= (page + 1) % 2;
             }
        }

        if (page >= 0 && page <= total_pages) {
            if (page === total_pages) {
                text = reader.getPageLabel(page);
            } else if (page === 0) {
                text = reader.getPageLabel(page + 1);
            } else {
                text = reader.getPageLabel(page) + "-" + reader.getPageLabel(page + 1);
            }
        }

        $page_num[0].textContent = text;
    };


    /*
    book.on('renderer:locationChanged', function(cfi){
        var cfiFragment = "#" + cfi;
        // save current position (cursor)
        reader.settings.session.setCursor(cfi);
        //-- Check if bookmarked
        if(!(reader.isBookmarked(cfi))) { //-- Not bookmarked
            $bookmark
                .removeClass("icon-turned_in")
                .addClass("icon-turned_in_not");
        } else { //-- Bookmarked
            $bookmark
                .addClass("icon-turned_in")
                .removeClass("icon-turned_in_not");
        }

        reader.currentLocationCfi = cfi;

        // Update the History Location
        if(reader.settings.history &&
            window.location.hash != cfiFragment) {
                // Add CFI fragment to the history
                history.pushState({}, '', cfiFragment);
            }
    });

    book.on('book:pageChanged', function(location){
        console.log("page", location.page, location.percentage)
    });
    */

    return {
        "show": show,
        "hide": hide,
        "toggle": toggle,
        "setZoomIcon": setZoomIcon,
        "setRotateIcon": setRotateIcon,
        "setCurrentPage": setCurrentPage,
        "setPageCount": setPageCount
    };
};