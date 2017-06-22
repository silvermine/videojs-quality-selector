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
         // Note: See `setSource` for the reason behind using both 'isDefault'
         // and 'isdefault'
         sources = _.map(sources, _.partial(_.omit, _, [ 'isDefault', 'isdefault' ]));
         selectedSource = _.findWhere(sources, { src: newSource.src });
         // Note: `_.findWhere` returns a reference to an object. Thus the
         // following updates the original object in `sources`.
         selectedSource.isDefault = true;

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

         setSource: function(autoSelectedSource, next) {
            var sources = player.currentSources(),
                defaultSource, selectedSource,
                qualitySelector;

            defaultSource = _.find(sources, function(source) {
               // While the simplest check would be `!!source.isDefault`, remember that
               // the sources can come from a `<source>` tag. Therefore, the lowercase
               // form, `isdefault`, needs to be checked.
               return source.isDefault === true
                  || source.isDefault === 'true'
                  || source.isdefault === true
                  || source.isdefault === 'true';
            });

            selectedSource = defaultSource || autoSelectedSource;

            // Update the quality selector with the new source
            qualitySelector = player.controlBar.getChild('qualitySelector');
            if (qualitySelector) {
               qualitySelector.update();
            }

            // Pass along selected source
            next(null, selectedSource);
         },

      };

   });

};
