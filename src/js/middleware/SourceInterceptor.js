'use strict';

var _ = require('underscore'),
    events = require('../events'),
    QUALITY_CHANGE_CLASS = 'vjs-quality-changing';

module.exports = function(videojs) {

   videojs.use('*', function(player) {

      player.on(events.QUALITY_SELECTED, function(event, newSource) {
         var sources = player.currentSources(),
             currentTime = player.currentTime(),
             isPaused = player.paused(),
             selectedSource;

         player.addClass(QUALITY_CHANGE_CLASS);

         // Find and set the new selected source
         sources = _.map(sources, _.partial(_.omit, _, 'selected'));
         selectedSource = _.findWhere(sources, { src: newSource.src });
         // Note: `_.findWhere` returns a reference to an object. Thus the
         // following updates the original object in `sources`.
         selectedSource.selected = true;

         player.src(sources);

         player.one('loadeddata', function() {
            player.removeClass(QUALITY_CHANGE_CLASS);
            player.currentTime(currentTime);
            if (!isPaused) {
               player.play();
            }
         });
      });

      return {

         setSource: function(playerSelectedSource, next) {
            var sources = player.currentSources(),
                userSelectedSource, chosenSource,
                qualitySelector;

            // There are generally two source options, the one that videojs
            // auto-selects and the one that a "user" of this plugin has
            // supplied via the `selected` property. `selected` can come from
            // either the `<source>` tag or the list of sources passed to
            // videojs using `src()`.

            userSelectedSource = _.find(sources, function(source) {
               // Must check for both boolean and string 'true' as sources set
               // programmatically should use a boolean, but those coming from
               // a `<source>` tag will use a string.
               return source.selected === true || source.selected === 'true';
            });

            chosenSource = userSelectedSource || playerSelectedSource;

            // Update the quality selector with the new source
            qualitySelector = player.controlBar.getChild('qualitySelector');
            if (qualitySelector) {
               qualitySelector.setSelectedSource(chosenSource);
            }

            // Pass along the chosen source
            next(null, chosenSource);
         },

      };

   });

};
