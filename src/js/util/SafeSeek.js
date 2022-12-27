class SafeSeek {
   constructor(player, seekToTime) {
      this._player = player;
      this._seekToTime = seekToTime;
      this._hasFinished = false;
      this._keepThisInstanceWhenPlayerSourcesChange = false;
      this._seekWhenSafe();
   }

   _seekWhenSafe() {
      var HAVE_FUTURE_DATA = 3;

      // `readyState` in Video.js is the same as the HTML5 Media element's `readyState`
      // property.
      //
      // `readyState` is an enum of 5 values (0-4), each of which represent a state of
      // readiness to play. The meaning of the values range from HAVE_NOTHING (0), meaning
      // no data is available to HAVE_ENOUGH_DATA (4), meaning all data is loaded and the
      // video can be played all the way through.
      //
      // In order to seek successfully, the `readyState` must be at least HAVE_FUTURE_DATA
      // (3).
      //
      // @see http://docs.videojs.com/player#readyState
      // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      // @see https://dev.w3.org/html5/spec-preview/media-elements.html#seek-the-media-controller
      if (this._player.readyState() < HAVE_FUTURE_DATA) {
         this._seekFn = this._seek.bind(this);
         // The `canplay` event means that the `readyState` is at least HAVE_FUTURE_DATA.
         this._player.one('canplay', this._seekFn);
      } else {
         this._seek();
      }
   }

   onPlayerSourcesChange() {
      if (this._keepThisInstanceWhenPlayerSourcesChange) {
         // By setting this to `false`, we know that if the player sources change again
         // the change did not originate from a quality selection change, the new sources
         // are likely different from the old sources, and so this pending seek no longer
         // applies.
         this._keepThisInstanceWhenPlayerSourcesChange = false;
      } else {
         this.cancel();
      }
   }

   onQualitySelectionChange() {
      // `onPlayerSourcesChange` will cancel this pending seek unless we tell it not to.
      // We need to reuse this same pending seek instance because when the player is
      // paused, the `preload` attribute is set to `none`, and the user selects one
      // quality option and then another, the player cannot seek until the player has
      // enough data to do so (and the `canplay` event is fired) and thus on the second
      // selection the player's `currentTime()` is `0` and when the video plays we would
      // seek to `0` instead of the correct time.
      if (!this.hasFinished()) {
         this._keepThisInstanceWhenPlayerSourcesChange = true;
      }
   }

   _seek() {
      this._player.currentTime(this._seekToTime);
      this._keepThisInstanceWhenPlayerSourcesChange = false;
      this._hasFinished = true;
   }

   hasFinished() {
      return this._hasFinished;
   }

   cancel() {
      this._player.off('canplay', this._seekFn);
      this._keepThisInstanceWhenPlayerSourcesChange = false;
      this._hasFinished = true;
   }
}

module.exports = SafeSeek;
