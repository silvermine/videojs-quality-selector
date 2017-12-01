'use strict';

var _ = require('underscore'),
    events = require('./events'),
    qualitySelectorFactory = require('./components/QualitySelector'),
    sourceInterceptorFactory = require('./middleware/SourceInterceptor');

module.exports = function(videojs) {
   videojs = videojs || window.videojs;

   qualitySelectorFactory(videojs);
   sourceInterceptorFactory(videojs);

   videojs.hook('setup', function(player) {
      // Add handler to switch sources when the user requests a change
      player.on(events.QUALITY_REQUESTED, function(event, newSource) {
         var sources = player.currentSources(),
             currentTime = player.currentTime(),
             isPaused = player.paused(),
             selectedSource;

         // Clear out any previously selected sources (see: #11)
         _.each(sources, function(source) {
            source.selected = false;
         });

         selectedSource = _.findWhere(sources, { src: newSource.src });
         // Note: `_.findWhere` returns a reference to an object. Thus the
         // following updates the original object in `sources`.
         selectedSource.selected = true;

         player.src(sources);

         player.one('loadeddata', function() {
            player.currentTime(currentTime);
            if (!isPaused) {
               player.play();
            }
         });
      });
   });
};

module.exports.EVENTS = events;
