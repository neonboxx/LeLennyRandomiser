'use strict';
var historyLength = 100;
document.addEventListener('DOMContentLoaded', function() {
	var faces ={};
	$.ajax({
	url: "/faces.json",
	dataType: "json",
	success: function(e){
		faces = e;
        new Clipboard('.btn').on('success', function(e) {
            e.clearSelection();
        });
        if(!localStorage.counter)
            localStorage.counter = 0;
        if(!localStorage.history)
            localStorage.history = '[]';
        generate();
        
	}
});
  $('.wrapper').click(function(){generate()}).one('click',function(){
      $('p').fadeOut();
  });
  $('.historyBtn').click(function(){
     showHistory();
  });
  $('.historyCloseBtn').click(function(){
      hideHistory();
  });
  var showHistory = function(){
      $('.history').fadeIn()
      var history = JSON.parse(localStorage.history)
      $('.lstHistory').html('')
      history.reverse().forEach(function(element) {
          $('.lstHistory').append($('<li>').text(element))
      }, this);
      new Clipboard('.lstHistory li',{
            target: function(trigger) {
                return trigger;
            }
        }).on('success', function(e) {
        e.clearSelection();
    });
  }
  var hideHistory = function(){
      $('.history').fadeOut()
  }


  var generate = function(){
		var mouthIdx = Math.floor((Math.random() * faces.mouth.length));
		var eyesIdx = Math.floor((Math.random() * faces.eyes.length));
		var earsIdx = Math.floor((Math.random() * faces.ears.length));

		var eyes = faces.eyes[eyesIdx];
		var mouth = faces.mouth[mouthIdx];
		var ears = faces.ears[earsIdx];


		var face = (ears[0]) + (eyes[0]) + (mouth)+(eyes.length > 1? eyes[1]:eyes[0]) + (ears.length > 1? ears[1]:ears[0]); 
        $('h1').text(face);
        $('.btn').trigger('click');
        localStorage.counter = parseInt(localStorage.counter) + 1;
        chrome.browserAction.setBadgeText({text: localStorage.counter})
        var history = JSON.parse(localStorage.history);
        history.push(face);
        if(history.length >= historyLength)
            history = history.slice(Math.max(history.length - historyLength, 1))
        localStorage.history = JSON.stringify(history)
	};
    

}, false);
