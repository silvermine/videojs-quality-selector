'use strict';

var _ = require('underscore'),
    events = require('./events'),
    qualitySelectorFactory = require('./components/QualitySelector'),
    sourceInterceptorFactory = require('./middleware/SourceInterceptor'),
    SafeSeek = require('./util/SafeSeek');

module.exports = function(videojs, userOpts) {
   videojs = videojs || window.videojs;

   qualitySelectorFactory(videojs, userOpts);
   sourceInterceptorFactory(videojs);

   videojs.hook('setup', function(player) {
      function changeQuality(event, newSource) {
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

         if (player._qualitySelectorSafeSeek) {
            player._qualitySelectorSafeSeek.onQualitySelectionChange();
         }

         player.src(sources);

         player.ready(function() {
            if (!player._qualitySelectorSafeSeek || player._qualitySelectorSafeSeek.hasFinished()) {
               // Either we don't have a pending seek action or the one that we have is no
               // longer applicable. This block must be within a `player.ready` callback
               // because the call to `player.src` above is asynchronous, and so not
               // having it within this `ready` callback would cause the SourceInterceptor
               // to execute after this block instead of before.
               //
               // We save the `currentTime` within the SafeSeek instance because if
               // multiple QUALITY_REQUESTED events are received before the SafeSeek
               // operation finishes, the player's `currentTime` will be `0` if the
               // player's `src` is updated but the player's `currentTime` has not yet
               // been set by the SafeSeek operation.
               player._qualitySelectorSafeSeek = new SafeSeek(player, currentTime);
            }

            if (!isPaused) {
               player.play();
            }
         });
      }

      // Add handler to switch sources when the user requests a change
      player.on(events.QUALITY_REQUESTED, changeQuality);
   });
};

module.exports.EVENTS = events;
