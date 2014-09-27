/* Hide suggestion div */
function invisibleSuggestion(){
    $('#search-suggestions').css('visibility', 'hidden');
    showingSuggestions = false;
}

/* Show suggestion div */
function visibleSuggestion(){
    $('#search-suggestions').css('visibility', 'visible');
    showingSuggestions = true;
    scrollTo(0);
}

/* Place suggestions div */
function suggestionLocation(){
    var offset = $('.search-bar').offset();
    $('#search-suggestions').offset({ top: (offset.top + $('#search-input').outerHeight() + 5), left: offset.left });
}

/* Smooth scroll if out of range */
function scrollTo(currentHeight){
    $('#search-suggestions').animate({
        scrollTop: (currentHeight)
    }, 500);
}

/* Submit by pjax */
function submitByPJAX(event) {
    $.pjax.submit(event, '#main-content');
    invisibleSuggestion();
    $('#search-input').blur();
    $('.search-form')[0].reset();
    $('#search-suggestions').empty();
}

/* A variable to track if suggestions are shown */
var showingSuggestions = false;

/* A variable to check if form is sent by button */
var submitByButton = false;

/* Minimum amount of letters to be able to search */
var minLength = 3;

suggestionLocation();

function searchSuggestOnload(){
    /* Change location of suggestions when window is resized */
    $(window).resize(function(){
        suggestionLocation();
    });

    /* Function to get search-results */
    $('#search-input').on('input', function(){
        var myInput = this.value;
        if(myInput.length > 0){
            visibleSuggestion();
            if(myInput.length >= minLength){
                /* Show loading animation */
                if($('#loading').length == 0){
                    $('#search-suggestions').prepend('<div id="loading"></div>');
                }

                $('#search-suggestions p').remove();

                $('#loading').load("/api/loading");

                $('#search-suggestions').load("/api/search", {'query': myInput});
            } else {
                $('#search-suggestions')
                    .empty()
                    .append('<p>Söktermer måste vara minst ' + minLength + ' bokstäver långa.</p>');
            }
        } else {
            invisibleSuggestion();
        }
    });

    /* Disable sending form if less than minLength letters typed
     * or if sent by enter and a search-suggestion is active. */
    $('.search-form').on('submit', function(e){
        if($('#search-input').val().length >= minLength){
            $('html, body').scrollTop(0);

            if(submitByButton){
                submitByButton = false;
                $('.search-form').attr('data-pjax', '');
                return;
            } else {
                var active = $('#search-suggestions').find('.active-search').first();

                if(active.length == 0){
                    $('.search-form').attr('data-pjax', '');
                    submitByPJAX(e);
                }
                e.preventDefault();
            }
        } else {
            $('#search-submit').popover({
                trigger: 'manual',
                placement: 'right',
                content: 'Söktermer måste vara minst ' + minLength + ' bokstäver långa.'
            });
            if(submitByButton){
                $('#search-submit').popover('show').on('shown.bs.popover', function (e) {
                    setTimeout(function () {
                        $(e.target).popover('hide');
                    }, 3000);
                });
            }
        }
        e.preventDefault();
        return false;
    });

    /* Submitting form with button to override active */
    $('#search-submit').on('click', function(){
        submitByButton = true;
        $('.search-form').submit();
    });

    /* Functions to hide the suggestion-div */
    $("body").click(function (e) {
        invisibleSuggestion();

        //Reset active suggestion
        var active = $('#search-suggestions').find('.active-search').first();
        active.removeClass('active-search');
    });

    /* Show div when click on input */
    $('#search-input').bind('click', function(e) {
        e.stopPropagation();
        var myInput = this.value;
        /* Only show results if query not empty */
        if(myInput.length > 0){
            visibleSuggestion();
        }
    });

    /* Keep div open on click */
    $('#search-suggestions').click(function(e) {
        e.stopImmediatePropagation();
        var target = $(e.target);

        if(target.is(":button")){
            buyButton(target);
        } else {
            e.stopPropagation();
        }
    });
    /* END Functions to hide the suggestion-div */

}

/* For iterating up and down the search suggestions */
function oneTimeSearchLoader() {
    $(document).keydown(function(e){
        //UP
        if(e.keyCode == 38 && showingSuggestions){
            var current = $('#search-suggestions').find('.active-search').first();

            if(current.length == 0){
                var last = $('#search-suggestions').find('.search-container').last();
                last.addClass('active-search');
                scrollTo(last.position().top);
            } else {
                var prev = current.prev('.search-container').first();

                if(prev.length != 0){
                    prev.addClass('active-search');
                    var position = prev.position();

                    if(position.top < 0){
                        var index = prev.prevAll('.search-container').length;
                        var firstOfPage = $('#search-suggestions').children('.search-container').eq(index - 4);
                        scrollTo(Math.abs(firstOfPage.position().top) * Math.floor(index / 5));
                    }
                }

                current.removeClass('active-search');
            }

            //Stop cursor from jumping
            return false;
        }

        //DOWN
        if(e.keyCode == 40 && showingSuggestions){
            var current = $('#search-suggestions').find('.active-search').first();

            console.log("%cCurrent:", 'font-weight: bold; color: #f00;');
            console.log(current);

            if(current.length == 0){
                var first = $('#search-suggestions').find('.search-container').first();
                first.addClass('active-search');
                scrollTo(0);
            } else {
                var next = current.next('.search-container').first();

                if(next.length != 0){
                    next.addClass('active-search');
                    var position = next.position();

                    if(position.top > $('#search-suggestions').height() - next.height()){
                        scrollTo(position.top * Math.floor(next.prevAll('.search-container').length / 5));
                    }
                }

                current.removeClass('active-search');
            }

            //Stop cursor from jumping
            return false;
        }

        //ENTER
        if(e.keyCode == 13 && showingSuggestions){
            var active = $('#search-suggestions').find('.active-search').first();

            if(active.length == 0){
                return;
            } else {
                var url = active.find('a').first();
                window.open(url.attr('href'), '_self');
            }
        }
    });
}

