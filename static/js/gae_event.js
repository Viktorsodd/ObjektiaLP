/**
 * Created by alexandercarl-petteraquist on 2014-07-02.
 */


//
// Using jQuery Event API v1.3
$('#area_button').on('click', function() {
  ga('send', 'event', 'button_area', 'click', 'area_more');
});

$('#market_button').on('click', function() {
  ga('send', 'event', 'button_market', 'click', 'market_more');
});

$('#future_button').on('click', function() {
  ga('send', 'event', 'button_future', 'click', 'future_more');
});

$('#life_button').on('click', function() {
  ga('send', 'event', 'button_life', 'click', 'life_more');
});

$('#neighbours_button').on('click', function() {
  ga('send', 'event', 'button_neighbours', 'click', 'neighbours_more');
});

$('#company_button').on('click', function() {
  ga('send', 'event', 'link_button_company', 'click', 'company_analysis');
});

$('#private_button').on('click', function() {
  ga('send', 'event', 'link_button_private', 'click', 'private_analysis');
});

$('#private_button').on('click', function() {
  ga('send', 'event', 'link_button_private', 'click', 'private_analysis');
});

$('#read-more-button').on('click', function() {
  ga('send', 'event', 'read_more_button', 'click', 'private_analysis');

});

$('#beta-top-button').on('click', function() {
  ga('send', 'event', 'beta_top_button', 'click', 'private_analysis');
});

$('#sign-up-btn').on('click', function() {
  ga('send', 'event', 'sign_up_beta', 'click', 'private_analysis');
});