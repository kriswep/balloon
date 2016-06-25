/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';





/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["baby.html","51395c25968e171d03fd1b589c3d01f0"],["index.html","90ed6de9bc51ec7a2c2f6356fdbe28bb"],["res/css/editor.css","4129a2755bea5c7b68000ff8e86f182f"],["res/css/ml.css","22fdc8d5338c7d8da64fb389ba6e0f4a"],["res/css/ui.css","531811704f2055b91660e46cf25695fb"],["res/img/Hintergrund.png","6fa524670799b86bdda4ca33001a85ce"],["res/img/Stern.png","1ad8e96939e2c1c4afc7aaa3386b1cd0"],["res/img/a1.png","fad90fa305af5e55fa36c9b6ed9a0b5d"],["res/img/a1s.png","196abb6aa2d440f931f58e9ade08e288"],["res/img/a2.png","d9262f3e569732cd9c83b6d68d6033ce"],["res/img/a3.png","7f5b4ed780dd9678c3e9309852a6e282"],["res/img/ati-114x114.png","e40af86f31591ce3020672cb3b92625e"],["res/img/ati-144x144.png","7446c5e0626e46a6bb76450d39e5ac5e"],["res/img/ati-192x192.png","a343fbd82ae1118f74a86f2778ea2c72"],["res/img/ati-57x57.png","32d1697ef28341139c2b4be6b9b1c9f6"],["res/img/ati-72x72.png","5f5195554644e6ee8ea9926c639ba87d"],["res/img/back.png","6fa524670799b86bdda4ca33001a85ce"],["res/img/ballong.png","be6a831e35c525270fb6b68a8ae4c698"],["res/img/ballongrosa.png","8d15072f6819c06e0b88b7f1c8010241"],["res/img/balloon.png","ac1644d6fbb1a2c66dd6e0ce57ff8cdd"],["res/img/brine.png","9a560c90c2f746435357c07147aa2629"],["res/img/e1.png","494dde063239fdd1328c5ad2f62b787f"],["res/img/e1_old.png","a082ec0dbd78eacc1f5942f559d9f557"],["res/img/herzluftballon.png","618cb6baadbf7f317e7af2d54556e439"],["res/img/komischerballong.png","091f66634df7a3adfd230f28255b88a3"],["res/img/m1l.png","115c6c136d079e81c266aa55fb688b6d"],["res/img/m1l_old.png","8de9ac6bc52cdb847391569ad7f2bd1a"],["res/img/m1r.png","1715d33b2ebff33e6d7e0be60e8e77f4"],["res/img/m1r_old.png","28a70927d621accea6f65b6ec6024028"],["res/img/m1s.png","aefa6363da7df43597bf88d1e6b92a38"],["res/img/rund.png","86bcd3e1fa54a340409f23b79509880d"],["res/img/sechseck.png","bdcf769564ae0ea3269883d88fb89883"],["res/img/sprite.png","97f9fa612c9d8d63b21bfcb5c647b54f"],["res/img/sprite2.png","94e030c68555e60e2dc90822b41cd4bd"],["res/img/sprite_old.png","7e8027242608bc07db12b5fca8f65e56"],["res/img/startup-320x460.png","e230f1a769557c55370fa9ae574c5402"],["res/img/tile16x16.png","5c21773c7f8e02cf48aafeb75cc2e796"],["res/img/tile32x32.png","e54bda05c7d3e3320437bb891efbe3ad"],["res/img/x1.png","7ba361a78cca56cbf2faf4965af1c4d0"],["res/img/x100.png","3a63c079e90f05f9978df387a51ae868"],["res/img/x2.png","f9158ad126eaddec1cfa605afb2aef98"],["res/img/x3.png","f66109b72faf1d34d418d134ff9515c4"],["res/js/jquery.js","cfa9051cc0b05eb519f1e16b2a6645d7"],["res/js/misc.js","d0c9fa31ff05c1b6cdec22ce2889780c"],["res/js/misc_b.js","2551d47b4ebc907a5db0f5504da191c2"],["res/js/modernizr-1.7.min.js","cddd8eaab4c55f7c1aef9a16b83c2692"],["res/js/resourceLoader.js","a11bac522664ba856897cc45599a8960"],["res/js/sw-register.js","373a64985db6c92d47e745b6b87bcf4c"],["res/js/ui.js","c271d59a8e990e322e6b4e7d692e0e72"],["res/js/wtballoon.js","d86465f5c3645e5ad7a96095431fcb2d"],["res/js/wtgm.js","7910041d0c562a970f89a426b686fbda"],["res/js/wtgm_b.js","df375c7906e335b4db6e990a4edc2087"],["res/js/wtmessage.js","1b181f2154b39824b3f23306f1274a51"],["res/levels/kidsl1.1.js","e7136e3a88392b4264ff37b8d9a7c314"],["res/levels/kidsl1.1_16x16.js","92a9c3118584e45940959858b9a1af4b"],["res/levels/l1.1.js","fb319f7e4403853ca2ec3b3396eb5958"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1-wtBalloon-' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var getCacheBustedUrl = function (url, param) {
    param = param || Date.now();

    var urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.search += (urlWithCacheBusting.search ? '&' : '') +
      'sw-precache=' + param;

    return urlWithCacheBusting.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var populateCurrentCacheNames = function (precacheConfig,
    cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    // Take a look at each of the cache names we expect for this version.
    Promise.all(Object.keys(CurrentCacheNamesToAbsoluteUrl).map(function(cacheName) {
      return caches.open(cacheName).then(function(cache) {
        // Get a list of all the entries in the specific named cache.
        // For caches that are already populated for a given version of a
        // resource, there should be 1 entry.
        return cache.keys().then(function(keys) {
          // If there are 0 entries, either because this is a brand new version
          // of a resource or because the install step was interrupted the
          // last time it ran, then we need to populate the cache.
          if (keys.length === 0) {
            // Use the last bit of the cache name, which contains the hash,
            // as the cache-busting parameter.
            // See https://github.com/GoogleChrome/sw-precache/issues/100
            var cacheBustParam = cacheName.split('-').pop();
            var urlWithCacheBusting = getCacheBustedUrl(
              CurrentCacheNamesToAbsoluteUrl[cacheName], cacheBustParam);

            var request = new Request(urlWithCacheBusting,
              {credentials: 'same-origin'});
            return fetch(request).then(function(response) {
              if (response.ok) {
                return cache.put(CurrentCacheNamesToAbsoluteUrl[cacheName],
                  response);
              }

              console.error('Request for %s returned a response status %d, ' +
                'so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          }
        });
      });
    })).then(function() {
      return caches.keys().then(function(allCacheNames) {
        return Promise.all(allCacheNames.filter(function(cacheName) {
          return cacheName.indexOf(CacheNamePrefix) === 0 &&
            !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    var navigateFallback = '';
    // Ideally, this would check for event.request.mode === 'navigate', but that is not widely
    // supported yet:
    // https://code.google.com/p/chromium/issues/detail?id=540967
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1209081
    if (!cacheName && navigateFallback && event.request.headers.has('accept') &&
        event.request.headers.get('accept').includes('text/html') &&
        /* eslint-disable quotes, comma-spacing */
        isPathWhitelisted([], event.request.url)) {
        /* eslint-enable quotes, comma-spacing */
      var navigateFallbackUrl = new URL(navigateFallback, self.location);
      cacheName = AbsoluteUrlToCacheName[navigateFallbackUrl.toString()];
    }

    if (cacheName) {
      event.respondWith(
        // Rely on the fact that each cache we manage should only have one entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              if (response) {
                return response;
              }
              // If for some reason the response was deleted from the cache,
              // raise and exception and fall back to the fetch() triggered in the catch().
              throw Error('The cache ' + cacheName + ' is empty.');
            });
          });
        }).catch(function(e) {
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});




