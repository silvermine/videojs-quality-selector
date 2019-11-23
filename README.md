# Silvermine VideoJS Quality/Resolution Selector

[![Build Status](https://travis-ci.org/silvermine/videojs-quality-selector.svg?branch=master)](https://travis-ci.org/silvermine/videojs-quality-selector)
[![Coverage Status](https://coveralls.io/repos/github/silvermine/videojs-quality-selector/badge.svg?branch=master)](https://coveralls.io/github/silvermine/videojs-quality-selector?branch=master)
[![Dependency Status](https://david-dm.org/silvermine/videojs-quality-selector.svg)](https://david-dm.org/silvermine/videojs-quality-selector)
[![Dev Dependency Status](https://david-dm.org/silvermine/videojs-quality-selector/dev-status.svg)](https://david-dm.org/silvermine/videojs-quality-selector?type=dev)


## What is it?

A plugin for [videojs](http://videojs.com/) versions 6+ that adds a button to the control
bar which will allow the user to choose from available video qualities or resolutions.


## How do I use it?

There are three primary steps to use this plug-in: [(1) including](#includingrequiring),
[(2) providing sources](#providing-video-sources), and [(3) adding the component the to
`controlBar`](#adding-to-the-player). Please see the following for information on each
step.

### Including/Requiring

#### Using `<script>` tag

The minified JS file can come from a downloaded copy or a CDN. When including
it, make sure that the `<script>` tag for the plugin appears _after_ the
include for [video.js](http://videojs.com/) (note that this plugin will look
for `videojs` at `window.videojs`).

There is an example of this in
[`docs/demo/index.html`](./docs/demo/index.html).

##### From local file:

```js
<script src="./path/to/video.min.js"></script>
<script src="./path/to/silvermine-videojs-quality-selector.min.js"></script>
```

##### From [`unpkg`](https://unpkg.com/silvermine-videojs-quality-selector/):

```js
<link href="https://unpkg.com/@silvermine/videojs-quality-selector/dist/css/quality-selector.css" rel="stylesheet">
<script src="./path/to/video.min.js"></script>
<script src="https://unpkg.com/@silvermine/videojs-quality-selector/dist/js/silvermine-videojs-quality-selector.min.js"></script>
```

#### Using `require`

When using NPM/Browserify, first install the plugin.

```
npm install --save @silvermine/videojs-quality-selector
```

For `videojs` to use the plug-in, the plugin needs to register itself with the instance of
`videojs`. This can be accomplished by:

```js
var videojs = require('videojs');

// The following registers the plugin with `videojs`
require('@silvermine/videojs-quality-selector')(videojs);
```

### Providing video sources

Sources can be provided with either the `<source>` tag or via the `src` function on the
instance of a `video.js` player.

#### Using `<source>`

```html
<video id="video_1" class="video-js vjs-default-skin" controls preload="auto" width="640" height="268" data-setup='{}'>
   <source src="https://example.com/video_720.mp4" type="video/mp4" label="720P">
   <source src="https://example.com/video_480.mp4" type="video/mp4" label="480P" selected="true">
   <source src="https://example.com/video_360.mp4" type="video/mp4" label="360P">
</video>
```

#### Using `player.src()`

```js
player.src([
   {
      src: 'https://example.com/video_720.mp4',
      type: 'video/mp4',
      label: '720P',
   },
   {
      src: 'https://example.com/video_480.mp4',
      type: 'video/mp4',
      label: '480P',
      selected: true,
   },
   {
      src: 'https://example.com/video_360.mp4',
      type: 'video/mp4',
      label: '360P',
   },
]);
```

### Adding to the player

There are at least two ways to add the quality selector control to the player's control
bar. The first is directly adding it via `addChild`. For example:

```
player.controlBar.addChild('QualitySelector');
```

The second option is to add the control via the player's options, for instance:

```
var options, player;

options = {
   controlBar: {
      children: [
         'playToggle',
         'progressControl',
         'volumePanel',
         'qualitySelector',
         'fullscreenToggle',
      ],
   },
};

player = videojs('video_1', options);
```

## How do I contribute?

We genuinely appreciate external contributions. See [our extensive
documentation](https://github.com/silvermine/silvermine-info#contributing) on how to
contribute.


## License

This software is released under the MIT license. See [the license file](LICENSE) for more
details.
