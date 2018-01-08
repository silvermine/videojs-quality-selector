'use strict';

var _ = require('underscore'),
    events = require('../events');

module.exports = function(videojs) {

   videojs.use('*', function(player) {

      return {

         setSource: function(playerSelectedSource, next) {
            var sources = player.currentSources(),
                userSelectedSource, chosenSource;

            if (player._qualitySelectorSafeSeek) {
               player._qualitySelectorSafeSeek.onPlayerSourcesChange();
            }

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

            player.trigger(events.QUALITY_SELECTED, chosenSource);

            // Pass along the chosen source
            next(null, chosenSource);
         },

      };

   });

};
