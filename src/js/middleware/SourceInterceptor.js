'use strict';

var _ = require('underscore');

module.exports = function(videojs) {

   videojs.use('*', function(player) {

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
