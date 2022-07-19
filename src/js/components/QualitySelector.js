var _ = require('underscore'),
    events = require('../events'),
    qualityOptionFactory = require('./QualityOption'),
    QUALITY_CHANGE_CLASS = 'vjs-quality-changing';

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

         // Update interface instantly so the user's change is acknowledged
         player.on(events.QUALITY_REQUESTED, function(event, newSource) {
            this.setSelectedSource(newSource);
            player.addClass(QUALITY_CHANGE_CLASS);

            player.one('loadeddata', function() {
               player.removeClass(QUALITY_CHANGE_CLASS);
            });
         }.bind(this));

         // Update the list of menu items only when the list of sources change
         player.on(events.PLAYER_SOURCES_CHANGED, function() {
            this.update();
         }.bind(this));

         player.on(events.QUALITY_SELECTED, function(event, newSource) {
            // Update the selected source with the source that was actually selected
            this.setSelectedSource(newSource);
         }.bind(this));

         // Since it's possible for the player to get a source before the selector is
         // created, make sure to update once we get a "ready" signal.
         player.one('ready', function() {
            this.selectedSrc = player.src();
            this.update();
         }.bind(this));

         this.controlText('Open quality selector menu');
      },

      /**
       * Updates the source that is selected in the menu
       *
       * @param source {object} player source to display as selected
       */
      setSelectedSource: function(source) {
         var src = (source ? source.src : undefined);

         if (this.selectedSrc !== src) {
            this.selectedSrc = src;
            _.each(this.items, function(item) {
               item.selected(item.source.src === src);
            });
         }
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
               selected: source.src === this.selectedSrc,
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
