'use strict';

var _ = require('underscore'),
    events = require('../events'),
    qualityOptionFactory = require('./QualityOption');

module.exports = function(videojs) {
   var MenuButton = videojs.getComponent('MenuButton'),
       QualityOption = qualityOptionFactory(videojs),
       QualitySelector;

   /**
    * A component for changing video resolutions
    *
    * @class QualitySelector
    * @extends videojs.Button
    */
   QualitySelector = videojs.extend(MenuButton, {

      /**
       * @inheritdoc
       */
      constructor: function(player, options) {
         MenuButton.call(this, player, options);

         this.selectedSource = options.selectedSource || player.currentSource();

         player.on(events.QUALITY_SELECTED, function(event, source) {
            this.setSelectedSource(source);
         }.bind(this));

         // Since it's possible for the player to get a source before the selector is
         // created, make sure to update once we get a "ready" signal.
         player.one('ready', function() {
            this.update();
         }.bind(this));
      },

      /**
       * Updates the source that is selected in the menu
       *
       * @param source {object} player source to display as selected
       */
      setSelectedSource: function(source) {
         this.selectedSource = source;
         this.update();
      },

      /**
       * @inheritdoc
       */
      createItems: function() {
         var player = this.player(),
             sources = player.currentSources();

         if (!sources || sources.length < 2) {
            return [];
         }

         return _.map(sources, function(source) {
            return new QualityOption(player, {
               source: source,
               selected: this.selectedSource ? source.src === this.selectedSource.src : false,
            });
         }.bind(this));
      },

      /**
       * @inheritdoc
       */
      buildWrapperCSSClass: function() {
         return 'vjs-quality-selector ' + MenuButton.prototype.buildWrapperCSSClass.call(this);
      },

   });

   videojs.registerComponent('QualitySelector', QualitySelector);

   return QualitySelector;
};
