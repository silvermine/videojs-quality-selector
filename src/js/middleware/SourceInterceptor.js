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

            if (!_.isEqual(sources, player._qualitySelectorPreviousSources)) {
               player.trigger(events.PLAYER_SOURCES_CHANGED, sources);
               player._qualitySelectorPreviousSources = sources;
            }

            // There are generally two source options, the one that videojs
            // auto-selects and the one that a "user" of this plugin has
            // supplied via the `selected` property. `selected` can come from
            // either the `<source>` tag or the list of sources passed to
            // videojs using `src()`.

            userSelectedSource = _.find(sources, function(source) {
               // Must check for boolean values as well as either the string 'true' or
               // 'selected'. When sources are set programmatically, the value will be a
               // boolean, but those coming from a `<source>` tag will be a string.
               return source.selected === true || source.selected === 'true' || source.selected === 'selected';
            });

            chosenSource = userSelectedSource || playerSelectedSource;

            player.trigger(events.QUALITY_SELECTED, chosenSource);

            // Pass along the chosen source
            next(null, chosenSource);
         },

      };

   });

};
