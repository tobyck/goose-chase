// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"83cNV":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 49405;
var HMR_SECURE = false;
var HMR_ENV_HASH = "a25e589c66234a52";
module.bundle.HMR_BUNDLE_ID = "2a909bfa0196f4b2";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets, assetsToDispose, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets); // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                } // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle, id) {
    // Execute the module.
    bundle(id); // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            }); // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"2G5F2":[function(require,module,exports) {
/*
 * main.ts
 *
 * This file contains the Game class which is a wrapper for everything
 * in the game and will be re-instantiated with each level. The Game class's 
 * constructor is also responsible for loading images and starting the gameLoop.
 * In the gameLoop, the canvas is cleared then the room's render function
 * handles rendering of room.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _components = require("./components");
var _controllable = require("./systems/controllable");
var _ecs = require("./engine/ecs");
var _mapgen = require("./engine/mapgen");
var _render = require("./systems/render");
var _helpers = require("./helpers");
var _walking = require("./systems/walking");
var _hit = require("./systems/hit");
var _place = require("./systems/place");
var _keyup = require("./systems/keyup");
var _healthbar = require("./systems/healthbar");
var _itemgen = require("./engine/itemgen");
var _weapon = require("./systems/weapon");
class Game {
    ecs = new (0, _ecs.ECS)(this);
    images = {};
    keys = {};
    constructor(canvas, level){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.level = level;
        document.addEventListener("keydown", (event)=>{
            this.keys[event.key.toLowerCase()] = true;
            this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).Keyboard);
        });
        document.addEventListener("keyup", (event)=>{
            this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).KeyUp);
            delete this.keys[event.key.toLowerCase()];
            this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).Keyboard);
        });
        document.addEventListener("click", (event)=>{
            this.setLastClickPos(event);
            this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).Click);
        });
        document.addEventListener("contextmenu", (event)=>{
            event.preventDefault(); // prevent context menu from opening
            this.setLastClickPos(event);
            this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).RightClick);
        });
        // level 1: 1x1
        // level 2: 2x1
        // level 3: 2x2
        // level 4: 3x2
        // ...
        this.roomCount = new (0, _helpers.Vec)(Math.ceil(level / 2), Math.ceil(level / 2));
        if (level % 2 === 0) this.roomCount.x++;
        // put the character in the middle of the map
        this.room = new (0, _helpers.Vec)(Math.floor(this.roomCount.x / 2), Math.floor(this.roomCount.y / 2));
        // size the rooms to have a roughly even number of tiles with different aspect ratios
        this.roomSize = new (0, _helpers.Vec)(null, null);
        this.roomSize.y = Math.floor(9 * (innerHeight / innerWidth + 1));
        this.tileSize = Math.floor(innerHeight / this.roomSize.y);
        this.roomSize.x = Math.floor(innerWidth / this.tileSize);
        // size the canvas to fit a room
        this.canvas.width = this.roomSize.x * this.tileSize;
        this.canvas.height = this.roomSize.y * this.tileSize;
        // turn off anti-aliasing
        this.ctx.imageSmoothingEnabled = false;
        // pre-load images
        const files = [
            "tiles",
            "player",
            "items",
            "item-box"
        ]; // list of filenames without extensions
        const promises = []; // list of promises, one for each image
        // create a promise for each image
        for (const file of files)promises.push(new Promise((resolve, reject)=>{
            const img = new Image();
            img.src = "./img/" + file + ".png";
            img.onload = ()=>resolve(img);
            img.onerror = (error)=>reject(error);
        }));
        // wait for all the images to load then...
        Promise.all(promises).then((images)=>{
            // store the images in the game instance for use elsewhere
            images.forEach((image, index)=>this.images[files[index]] = image);
            // add boxes to show items held by the player
            this.leftHandItemPos = this.addItemBox(new (0, _helpers.Vec)(this.tileSize, (this.roomSize.y - 4) * this.tileSize));
            this.rightHandItemPos = this.addItemBox(new (0, _helpers.Vec)((this.roomSize.x - 4) * this.tileSize, (this.roomSize.y - 4) * this.tileSize));
            // add the player
            this.player = this.ecs.createEntity();
            this.ecs.addComponent(game.player, _components.ImageComponent, [
                this.images["player"],
                new (0, _helpers.Rect)(0, 0, 16, 16)
            ]);
            // put the player in the middle of the room
            this.ecs.addComponent(game.player, _components.PositionComponent, [
                new (0, _helpers.Vec)((this.roomSize.x / 2 - .5) * this.tileSize, (this.roomSize.y / 2 - .5) * this.tileSize),
                this.room
            ]);
            this.ecs.addComponent(game.player, _components.SpeedComponent, [
                this.tileSize / 20
            ]); // move 1/20 of a tile per frame
            this.ecs.addComponent(game.player, _components.WalkingComponent);
            this.ecs.addComponent(game.player, _components.ControllableComponent);
            this.ecs.addComponent(game.player, _components.HandsComponent, [
                null,
                null
            ]);
            this.ecs.addComponent(game.player, _components.HealthComponent, [
                100
            ]);
            this.ecs.addComponent(game.player, _components.HitboxComponent, [
                (0, _helpers.Rect).fromVecs(new (0, _helpers.Vec)(2, 0).scaled(16, this.tileSize).shifted(new (0, _helpers.Vec)(0, 2)), new (0, _helpers.Vec)(12, 16).scaled(16, this.tileSize).shifted(new (0, _helpers.Vec)(0, -2)))
            ]);
            // generate the rooms using the function in mapgen.ts
            this.rooms = (0, _mapgen.generateMap)(this);
            // add items to the rooms
            (0, _itemgen.addItems)(this);
            // bring the player to the front so they are drawn on top of everything else
            // (this is so that items without hitboxes will be drawn behind the player)
            this.ecs.bringToFront(this.player);
            // add systems
            this.ecs.systemManager.addSystem(new (0, _controllable.ControllableSystem)());
            this.ecs.systemManager.addSystem(new (0, _walking.WalkingSystem)());
            this.ecs.systemManager.addSystem(new (0, _hit.HitSystem)());
            this.ecs.systemManager.addSystem(new (0, _place.PlaceSystem)());
            this.ecs.systemManager.addSystem(new (0, _keyup.KeyUpSystem)());
            this.ecs.systemManager.addSystem(new (0, _render.RenderSystem)());
            this.ecs.systemManager.addSystem(new (0, _healthbar.HealthBarSystem)());
            this.ecs.systemManager.addSystem(new (0, _weapon.WeaponSystem)());
            // start the game loop
            this.tick();
        });
    }
    // method to get the position of the last mouse click relative to the canvas
    setLastClickPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.lastClickPos = new (0, _helpers.Vec)(event.clientX - rect.left, event.clientY - rect.top);
    }
    // method to add a box to show items held by the player
    // returns the pixel position of where the item inside should be
    addItemBox(pos) {
        const itemBox = this.ecs.createEntity();
        this.ecs.addComponent(itemBox, _components.ImageComponent, [
            this.images["item-box"],
            new (0, _helpers.Rect)(0, 0, 48, 48),
            new (0, _helpers.Vec)(this.tileSize * 3, this.tileSize * 3)
        ]);
        this.ecs.addComponent(itemBox, _components.PositionComponent, [
            pos,
            this.room
        ]);
        this.ecs.addComponent(itemBox, _components.HitboxComponent, [
            (0, _helpers.Rect).fromVecs(new (0, _helpers.Vec)(11, 11).scaled(16, this.tileSize), new (0, _helpers.Vec)(26, 26).scaled(16, this.tileSize))
        ]);
        return pos.shifted(new (0, _helpers.Vec)(this.tileSize, this.tileSize));
    }
    // re-render the whole game every frame using requestAnimationFrame
    tick() {
        // find the current room and render 
        this.currentRoom.render();
        // update all systems triggerd by rendering
        this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).Tick);
        // request the next frame
        requestAnimationFrame(()=>this.tick());
    }
    // getter function to find the current room
    get currentRoom() {
        return this.rooms.find((room)=>(0, _helpers.Vec).equal(room.pos, this.room));
    }
}
exports.default = Game;
const game = new Game(document.querySelector("canvas"), 4);

},{"./components":"hVzNr","./systems/controllable":"6hz4e","./engine/ecs":"bTIAG","./systems/render":"lpuAS","./helpers":"e7qJp","./systems/walking":"jMNjN","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","./engine/mapgen":"lyfm3","./systems/place":"5rRAM","./systems/keyup":"gd8Fk","./systems/healthbar":"tDHYI","./systems/hit":"1OXJn","./engine/itemgen":"2lDf3","./systems/weapon":"el55c"}],"hVzNr":[function(require,module,exports) {
/* 
 * components.ts
 *
 * Stores all components in the game. These will usually just contain data,
 * but occasionally a couple of small methods, or sometimes no data at all
 * if it's just a flag to indicate that an entity has a certain capability.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PositionComponent", ()=>PositionComponent);
parcelHelpers.export(exports, "ImageComponent", ()=>ImageComponent);
parcelHelpers.export(exports, "SpeedComponent", ()=>SpeedComponent);
parcelHelpers.export(exports, "HitboxComponent", ()=>HitboxComponent);
parcelHelpers.export(exports, "HandsComponent", ()=>HandsComponent);
parcelHelpers.export(exports, "HealthComponent", ()=>HealthComponent);
parcelHelpers.export(exports, "WeaponComponent", ()=>WeaponComponent);
// entity can be controlled by the user
parcelHelpers.export(exports, "ControllableComponent", ()=>ControllableComponent);
// these components don't need data, they're just flags
parcelHelpers.export(exports, "WalkingComponent", ()=>WalkingComponent) // entity can walk
;
parcelHelpers.export(exports, "HoldableComponent", ()=>HoldableComponent) // entity can be picked up
;
var _ecs = require("./engine/ecs");
var _helpers = require("./helpers");
class PositionComponent {
    constructor(pixels, room){
        this.pixels = pixels;
        this.room = room;
    }
    getCentre(tileSize) {
        return new (0, _helpers.Vec)(this.pixels.x + tileSize / 2, this.pixels.y + tileSize / 2);
    }
}
class ImageComponent {
    // time when the frame was last changed
    lastFrameChange = Date.now();
    constructor(image, frame, dest){
        this.image = image;
        this.frame = frame;
        this.dest = dest || new (0, _helpers.Vec)(null, null);
    }
}
class SpeedComponent {
    constructor(velocity){
        this.velocity = velocity;
        this.speedX = 0;
        this.speedY = 0;
    }
    speedsTo(dx, dy) {
        const hypot = Math.hypot(dx, dy);
        return [
            dx / hypot * this.velocity,
            dy / hypot * this.velocity
        ];
    }
    get currentVelocity() {
        return Math.hypot(this.speedX, this.speedY);
    }
}
class HitboxComponent extends (0, _helpers.Rect) {
    constructor(rect){
        super(rect.x, rect.y, rect.width, rect.height);
    }
    getActualHitbox(entityPos) {
        return new HitboxComponent(new (0, _helpers.Rect)(this.x + entityPos.pixels.x, this.y + entityPos.pixels.y, this.width, this.height));
    }
}
class HandsComponent {
    constructor(leftHand, rightHand){
        this.leftHand = leftHand;
        this.rightHand = rightHand;
    }
    // checks if there's a free hand
    hasSpace() {
        return this.leftHand === null || this.rightHand === null;
    }
    // checks if both hands are empty
    allEmpty() {
        return this.leftHand === null && this.rightHand === null;
    }
    // adds an item to a free hand and returns the item
    addItem(item, hand) {
        if (hand === "left" && this.leftHand === null) {
            this.leftHand = item;
            return item;
        }
        if (this.rightHand === null) {
            this.rightHand = item;
            return item;
        }
        return null;
    }
    // remove the left hand item if present, otherwise right hand item, and return it
    takeItem() {
        if (this.leftHand !== null) {
            const item = this.leftHand;
            this.leftHand = null;
            return [
                item,
                "left"
            ];
        } else if (this.rightHand !== null) {
            const item = this.rightHand;
            this.rightHand = null;
            return [
                item,
                "right"
            ];
        } else return null;
    }
}
class HealthComponent {
    constructor(maxHealth){
        this.health = maxHealth;
        this.maxHealth = maxHealth;
    }
    heal(amount) {
        // add the amount, but don't go over the max health
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    damage(amount) {
        this.health = Math.max(this.health - amount, 0);
        this.health;
    }
}
class WeaponComponent extends (0, _ecs.Component) {
    constructor(damage){
        super();
        this.damage = damage;
    }
}
class ControllableComponent {
    sneaking = false;
}
class WalkingComponent {
}
class HoldableComponent {
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","./helpers":"e7qJp","./engine/ecs":"bTIAG"}],"b4oyH":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"e7qJp":[function(require,module,exports) {
/* 
 * util.ts
 *
 * This file contains useful miscellaneous functions and 
 * classes used throughout the codebase.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vec", ()=>Vec);
parcelHelpers.export(exports, "Rect", ()=>Rect);
parcelHelpers.export(exports, "randInt", ()=>randInt);
parcelHelpers.export(exports, "anyHitboxesCollide", ()=>anyHitboxesCollide);
parcelHelpers.export(exports, "attemptPlace", ()=>attemptPlace);
var _components = require("./components");
class Vec {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }
    shifted(vec) {
        return new Vec(this.x + vec.x, this.y + vec.y);
    }
    // scale a vector from one range to another
    scaled(from, to) {
        return new Vec(this.x / from * to, this.y / from * to);
    }
    // returns the vector of the center given the width of a tile
    centred(tileSize) {
        return new Vec(this.x + tileSize / 2, this.y + tileSize / 2);
    }
    // checks if a vector is inside a rectangle
    isInside(rect) {
        return this.x >= rect.x && this.x <= rect.x + rect.width && this.y >= rect.y && this.y <= rect.y + rect.height;
    }
    clone() {
        return new Vec(this.x, this.y);
    }
}
class Rect {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    overlaps(other) {
        return this.x < other.x + other.width && this.x + this.width > other.x && this.y < other.y + other.height && this.y + this.height > other.y;
    }
    static fromVecs(pos, size) {
        return new Rect(pos.x, pos.y, size.x, size.y);
    }
}
const randInt = (min, max)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const anyHitboxesCollide = (game, entity)=>{
    return game.currentRoom.entities.some((otherEntity)=>{
        // don't check if the entity collides with itself
        if (otherEntity === entity) return false;
        if (game.ecs.hasComponent(otherEntity, (0, _components.HitboxComponent))) {
            const hitbox = game.ecs.getComponent(entity, (0, _components.HitboxComponent)).getActualHitbox(game.ecs.getComponent(entity, (0, _components.PositionComponent)));
            const otherHitbox = game.ecs.getComponent(otherEntity, (0, _components.HitboxComponent)).getActualHitbox(game.ecs.getComponent(otherEntity, (0, _components.PositionComponent)));
            return hitbox.overlaps(otherHitbox);
        }
        // if the entity doesn't have a hitbox, it can't collide with anything
        return false;
    });
};
const attemptPlace = (game, hands, pos)=>{
    /* 
     * This if statement makes sure that an item isn't placed if either there's
     * nothing to place, or if placing it could cause it to be within half
     * a tile width of the edge of the room. The reason for this is that the
     * player doesn't move into the next room unless they're at least half way
     * through the door, so if an item is placed too close to the edge, its
     * hitbox could be withing reach of the the player if they're protruding
     * into the next room, but wouldn't taken into account in the collision
     * detection because it's not in the player's room.
     */ if (hands.allEmpty() || pos.x < game.tileSize / 2 || pos.y < game.tileSize / 2 || pos.x > (game.roomSize.x - 1) * game.tileSize - game.tileSize / 2 || pos.y > (game.roomSize.y - 1) * game.tileSize - game.tileSize / 2) return false;
    const [item, hand] = hands.takeItem();
    const itemPosition = game.ecs.getComponent(item, (0, _components.PositionComponent));
    const oldPixelPos = itemPosition.pixels.clone();
    itemPosition.pixels = pos;
    if (game.ecs.hasComponent(item, (0, _components.HitboxComponent)) && anyHitboxesCollide(game, item)) {
        itemPosition.pixels = oldPixelPos;
        hands.addItem(item, hand);
        return false;
    } else {
        /* 
         * When the item was in a hand the room vector was bound to
         * the game's current room so that it would always be in the
         * same room as the player. Now that it's been placed, we
         * need to set it to a clone of that position so it's always
         * in the room it was just placed in (until picked up again).
         */ itemPosition.room = itemPosition.room.clone();
        game.ecs.bringToFront(item);
        game.ecs.bringToFront(game.player);
        return true;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","./components":"hVzNr"}],"bTIAG":[function(require,module,exports) {
/* 
 * engine/ecs.ts
 *
 * This file implements a framework for the ECS to built with.
 * Entities are simply stored as numbers representing their ID; and components
 * are tied to them through ComponentManager objects (one for each type
 * of component). Systems are functions which act upon entities with certain
 * components, and are all managed by a SystemManager object. All of these
 * things are wrapped in the ECS class which is used by the game object.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// an abstract class for components to extend from for type safety
parcelHelpers.export(exports, "Component", ()=>Component);
parcelHelpers.export(exports, "SystemTrigger", ()=>SystemTrigger);
parcelHelpers.export(exports, "System", ()=>System);
// class to manage all systems active in a room
parcelHelpers.export(exports, "SystemManager", ()=>SystemManager);
// container to hold all ECS related data and useful methods for accessing them
parcelHelpers.export(exports, "ECS", ()=>ECS);
class Component {
}
// class to manage all components of type T
class ComponentManager {
    components = {};
    addComponent(entity, component) {
        this.components[entity] = component;
    }
    removeComponent(entity) {
        delete this.components[entity];
    }
    getComponent(entity) {
        return this.components[entity];
    }
}
let SystemTrigger;
(function(SystemTrigger) {
    SystemTrigger[SystemTrigger["Tick"] = 0] = "Tick";
    SystemTrigger[SystemTrigger["Keyboard"] = 1] = "Keyboard";
    SystemTrigger[SystemTrigger["KeyUp"] = 2] = "KeyUp";
    SystemTrigger[SystemTrigger["Click"] = 3] = "Click";
    SystemTrigger[SystemTrigger["RightClick"] = 4] = "RightClick";
})(SystemTrigger || (SystemTrigger = {}));
class System {
    requiredComponents = [];
    constructor(requiredComponents, trigger, update){
        this.requiredComponents = requiredComponents;
        this.trigger = trigger;
        this.update = update;
    }
}
class SystemManager {
    systems = [];
    constructor(game){
        this.game = game;
    }
    addSystem(system) {
        this.systems.push(system);
    }
    // when the updateSystems method is called, systems with the specified trigger will update
    updateSystems(trigger) {
        // get all systems with the specified trigger
        const systems = this.systems.filter((system)=>system.trigger === trigger);
        // get entities in the current room
        const entities = this.game.currentRoom.entities;
        // for each system with the specified trigger
        for (const system of systems)for (const entity of this.game.ecs.entitiesWithComponents(this.game.currentRoom, system.requiredComponents))system.update(this.game, entity);
    }
}
class ECS {
    entities = [];
    componentManagers = new Map();
    constructor(game){
        this.systemManager = new SystemManager(game);
    }
    // add an entity with a unique ID
    createEntity() {
        let entityId = this.entities.length;
        // find the next available entity ID if the current one is taken
        while(this.entities.includes(entityId))entityId++;
        // add the entity to the list of entities
        this.entities.push(entityId);
        return entityId;
    }
    // remove an entity and all of its components
    removeEntity(entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        for (const componentManager of this.componentManagers.values())if (componentManager.components[entity]) componentManager.removeComponent(entity);
    }
    // brings an entity to the end of the list of entities so it's rendered on top
    bringToFront(entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        this.entities.push(entity);
    }
    hasComponent(entity, component) {
        return this.componentManagers.get(component)?.getComponent(entity) !== undefined;
    }
    addComponent(entity, component, args = []) {
        // if there isn't already a component manager for the component, create one
        if (!this.componentManagers.has(component)) this.componentManagers.set(component, new ComponentManager());
        this.componentManagers.get(component).addComponent(entity, new component(...args));
    }
    getComponent(entity, component) {
        return this.componentManagers.get(component).getComponent(entity);
    }
    entitiesWithComponents(room, components) {
        const entities = [];
        for (const entity of room.entities){
            // assume the entity has all required components until proven otherwise
            let hasComponents = true;
            for (const component of components)// if the entity doesn't have a required component it shouldn't be added to the list
            if (!this.hasComponent(entity, component)) {
                hasComponents = false;
                break;
            }
            if (hasComponents) entities.push(entity);
        }
        return entities;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"6hz4e":[function(require,module,exports) {
/* 
 * systems/controllable.ts
 *
 * This system is responsible for adjusting the horizontal and vertical speed
 * (stored in the speed component) of controllable entities based on keynoard
 * input, and moving the entity between rooms when it goes through a door. 
 * The system doesn't actually move the entity - that's done by the walking 
 * system in walking.ts.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ControllableSystem", ()=>ControllableSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
class ControllableSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.ControllableComponent,
            _components.SpeedComponent,
            _components.PositionComponent
        ], (0, _ecs.SystemTrigger).Keyboard, (game, entity)=>{
            // get components
            const speed = game.ecs.getComponent(entity, _components.SpeedComponent);
            if (game.keys["a"] || game.keys["arrowleft"]) {
                if (game.keys["w"] || game.keys["arrowup"]) [speed.speedX, speed.speedY] = speed.speedsTo(-1, -1);
                else if (game.keys["s"] || game.keys["arrowdown"]) [speed.speedX, speed.speedY] = speed.speedsTo(-1, 1);
                else [speed.speedX, speed.speedY] = speed.speedsTo(-1, 0);
            } else if (game.keys["d"] || game.keys["arrowright"]) {
                if (game.keys["w"] || game.keys["arrowup"]) [speed.speedX, speed.speedY] = speed.speedsTo(1, -1);
                else if (game.keys["s"] || game.keys["arrowdown"]) [speed.speedX, speed.speedY] = speed.speedsTo(1, 1);
                else [speed.speedX, speed.speedY] = speed.speedsTo(1, 0);
            } else if (game.keys["w"] || game.keys["arrowup"]) [speed.speedX, speed.speedY] = speed.speedsTo(0, -1);
            else if (game.keys["s"] || game.keys["arrowdown"]) [speed.speedX, speed.speedY] = speed.speedsTo(0, 1);
            else {
                speed.speedX = 0;
                speed.speedY = 0;
            }
            // use shift key to sneak
            // at the moment this does nothing, but once enemies are 
            // added it will make it harder for them to find you
            if (game.keys["shift"]) {
                // halve the speed
                speed.speedX /= 2;
                speed.speedY /= 2;
                // let the ControllableComponent know that the entity is sneaking
                const ControllableComponent = game.ecs.getComponent(entity, _components.ControllableComponent);
                ControllableComponent.sneaking = true;
            }
            // get position component
            const position = game.ecs.getComponent(entity, _components.PositionComponent);
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"lpuAS":[function(require,module,exports) {
/* 
 * systems/render.ts
 *
 * The system responsible for rendering every single entity in the game.
 * Properties of the image component can be changed in other 
 * systems to create animations, because this systems renders whichever 
 * part of the image is specified in the component at the time of rendering.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "RenderSystem", ()=>RenderSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
class RenderSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.PositionComponent,
            _components.ImageComponent
        ], (0, _ecs.SystemTrigger).Tick, (game, entity)=>{
            // get the position and speed components
            const positionComponent = game.ecs.getComponent(entity, _components.PositionComponent);
            const imageComponent = game.ecs.getComponent(entity, _components.ImageComponent);
            // draw the image at the specified position
            game.ctx.drawImage(imageComponent.image, imageComponent.frame.x, imageComponent.frame.y, imageComponent.frame.width, imageComponent.frame.height, positionComponent.pixels.x, positionComponent.pixels.y, imageComponent.dest.x ?? game.tileSize, imageComponent.dest.y ?? game.tileSize);
            // if holding the h key and the entity has a hitbox, render the hitbox
            if (game.keys["h"] && game.ecs.hasComponent(entity, _components.HitboxComponent)) {
                const hitbox = game.ecs.getComponent(entity, _components.HitboxComponent).getActualHitbox(positionComponent);
                game.ctx.strokeStyle = "#ff2222";
                game.ctx.lineWidth = Math.ceil(game.tileSize / 90);
                game.ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
            }
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"jMNjN":[function(require,module,exports) {
/* 
 * systems/controllable.ts
 * 
 * This is the system that animates walking characters using their spritesheet
 * (stored in the image component), and actually moving walking entities by
 * their speed, unless there's an entity with a hitbox in the way. This means
 * that this sytem is also responsible for collision checking.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WalkingSystem", ()=>WalkingSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
var _helpers = require("../helpers");
class WalkingSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.WalkingComponent,
            _components.SpeedComponent,
            _components.ImageComponent
        ], (0, _ecs.SystemTrigger).Tick, (game, entity)=>{
            const speed = game.ecs.getComponent(entity, _components.SpeedComponent);
            const image = game.ecs.getComponent(entity, _components.ImageComponent);
            const position = game.ecs.getComponent(entity, _components.PositionComponent);
            // set the row of spritesheet for direction
            if (speed.speedX === 0 && speed.speedY === 0) image.frame.y = 0; // top row of spritesheet
            else {
                if (speed.speedX < 0) image.frame.y = 32; // third row of spritesheet
                else if (speed.speedX > 0) image.frame.y = 48; // last row of spritesheet
                else if (speed.speedY < 0) image.frame.y = 16; // second row of spritesheet
                else if (speed.speedY > 0) image.frame.y = 0; // top row of spritesheet
            }
            position.pixels.x += speed.speedX; // move by x speed
            // if there's a collision, move back
            if ((0, _helpers.anyHitboxesCollide)(game, entity)) position.pixels.x -= speed.speedX;
            // same thing with y speed
            position.pixels.y += speed.speedY;
            if ((0, _helpers.anyHitboxesCollide)(game, entity)) position.pixels.y -= speed.speedY;
            // if moving
            if (speed.speedX !== 0 || speed.speedY !== 0) {
                // change frame every x milliseconds depending on speed (350 is arbitrary)
                const timeBetweenFrames = 1 / speed.currentVelocity * 350;
                if (Date.now() - image.lastFrameChange >= timeBetweenFrames) {
                    image.frame.x += 16; // move right one frame
                    image.frame.x %= 64; // wrap around to the first frame if at the end
                    image.lastFrameChange = Date.now();
                }
            } else image.frame.x = 0;
            // if the entity has health
            if (game.ecs.hasComponent(entity, _components.HealthComponent)) {
                const health = game.ecs.getComponent(entity, _components.HealthComponent);
                // remove health based on speed (1/150th of the velocity per tick)
                health.damage(speed.currentVelocity / 150);
                // heal if resting (1/2000th of the max health per tick)
                if (speed.currentVelocity === 0) health.heal(health.maxHealth / 2000);
            }
            // move to neighboring room if walking through door
            if (position.pixels.x < -(game.tileSize / 2) && position.room.x > 0) {
                position.room.x--;
                position.pixels.x = game.tileSize * game.roomSize.x - game.tileSize / 2;
            } else if (position.pixels.x > game.tileSize * game.roomSize.x - game.tileSize / 2 && position.room.x < game.roomSize.x - 1) {
                position.room.x++;
                position.pixels.x = -(game.tileSize / 2);
            } else if (position.pixels.y < -(game.tileSize / 2) && position.room.y > 0) {
                position.room.y--;
                position.pixels.y = game.tileSize * game.roomSize.y - game.tileSize / 2;
            } else if (position.pixels.y > game.tileSize * game.roomSize.y - game.tileSize / 2 && position.room.y < game.roomSize.y - 1) {
                position.room.y++;
                position.pixels.y = -(game.tileSize / 2);
            }
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","../helpers":"e7qJp","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"lyfm3":[function(require,module,exports) {
/* 
 * engine/mapgen.ts
 *
 * This file is responsible for generating the map (a flat array of rooms),
 * adding wall entities, and leaving gaps for doors into adjacent rooms
 * which also line up with the doors in the adjacent rooms.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "generateMap", ()=>generateMap);
var _components = require("../components");
var _helpers = require("../helpers");
var _room = require("./room");
/* 
 * Given the minimum distance from the side of the room, and the width of the door
 * return an array of numbers representing where the door is. For #####...## 
 * (where # is a wall and . is a floor tile i.e. the door leading into another room)
 * the array would be [5, 6, 7], sideWidth would be 10, and doorWidth would be 3.
 */ const generateDoor = (minDistFromSide, sideWidth, doorWidth)=>{
    // first tile of the door
    const start = (0, _helpers.randInt)(minDistFromSide, sideWidth - minDistFromSide - doorWidth);
    // return the range [start, start + doorWidth]
    return Array(doorWidth).fill(null).map((_, i)=>start + i);
};
const generateMap = (game)=>{
    const rooms = [];
    for(let roomY = 0; roomY < game.roomCount.y; roomY++)for(let roomX = 0; roomX < game.roomCount.x; roomX++){
        const roomPos = new (0, _helpers.Vec)(roomX, roomY);
        const room = new (0, _room.Room)(game, roomPos);
        // generate doors for each side of the room
        room.doors = {
            top: generateDoor(5, game.roomSize.x, 4),
            bottom: generateDoor(5, game.roomSize.x, 4),
            left: generateDoor(3, game.roomSize.y, 3),
            right: generateDoor(3, game.roomSize.y, 3)
        };
        // remove doors that would lead outside the map
        if (roomX === 0) room.doors.left = []; // if the room is on the left edge of the map, remove the left door
        if (roomY === 0) room.doors.top = []; // if the room is on the top edge, remove the top door
        if (roomX === game.roomCount.x - 1) room.doors.right = []; // and so on...
        if (roomY === game.roomCount.y - 1) room.doors.bottom = [];
        // function to get the room at a given vector from the local rooms array
        const roomAtVec = (vec)=>rooms.find((room)=>(0, _helpers.Vec).equal(room.pos, vec));
        // takes a door from another room if there it's there
        const takeDoorFrom = (from, to, door // which door to take
        )=>{
            if (!roomAtVec(from)) return; // if there's no room there, return
            to.doors[door] = roomAtVec(from).doors[// get the opposite door
            ({
                top: "bottom",
                bottom: "top",
                left: "right",
                right: "left"
            })[door]];
        };
        // remove doors if there's a room on the other side
        takeDoorFrom(roomPos.shifted(new (0, _helpers.Vec)(0, -1)), room, "top");
        takeDoorFrom(roomPos.shifted(new (0, _helpers.Vec)(0, 1)), room, "bottom");
        takeDoorFrom(roomPos.shifted(new (0, _helpers.Vec)(-1, 0)), room, "left");
        takeDoorFrom(roomPos.shifted(new (0, _helpers.Vec)(1, 0)), room, "right");
        rooms.push(room);
        // for each tile position in the room
        for(let y = 0; y < game.roomSize.y; y++){
            for(let x = 0; x < game.roomSize.x; x++)if (x === 0 || y === 0 || x === game.roomSize.x - 1 || y === game.roomSize.y - 1) {
                // create an entity with no components
                const wallEntity = game.ecs.createEntity();
                // add a position component with the pixel position and room position
                game.ecs.addComponent(wallEntity, _components.PositionComponent, [
                    new (0, _helpers.Vec)(x * game.tileSize, y * game.tileSize),
                    roomPos
                ]);
                // 2nd and third args for ImageComponent (see componentns/image.ts)
                let frame;
                // args for HitboxComponent (x, y, width, height)
                let hitbox = [
                    new (0, _helpers.Vec)(0, 0),
                    new (0, _helpers.Vec)(16, 16)
                ]; // pixels on the spritesheet
                /*
                         * The following if/else statements select the correct frame 
                         * in the spritesheet for the wall based on it's position.
                         * Unfortunately it's not very readable because it's hardcoded
                         * and there isn't really a better way to do it :(
                         */ if (x === 0) {
                    if (y === 0) frame = [
                        0,
                        48
                    ];
                    else if (y === game.roomSize.y - 1) frame = [
                        32,
                        48
                    ];
                    else if (y === room.doors.left[0] - 1) {
                        frame = [
                            48,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 0),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (y === room.doors.left[room.doors.left.length - 1] + 1) {
                        frame = [
                            16,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 2),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (!room.doors.left.includes(y)) {
                        frame = [
                            48,
                            16
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 0),
                            new (0, _helpers.Vec)(14, 16)
                        ];
                    } else // don't add a wall if there's a door
                    game.ecs.removeEntity(wallEntity);
                } else if (x === game.roomSize.x - 1) {
                    if (y === 0) frame = [
                        16,
                        48
                    ];
                    else if (y === game.roomSize.y - 1) frame = [
                        48,
                        48
                    ];
                    else if (y === room.doors.right[0] - 1) {
                        frame = [
                            32,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(2, 0),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (y === room.doors.right[room.doors.right.length - 1] + 1) {
                        frame = [
                            0,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(2, 2),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (!room.doors.right.includes(y)) {
                        frame = [
                            16,
                            16
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(2, 0),
                            new (0, _helpers.Vec)(14, 16)
                        ];
                    } else game.ecs.removeEntity(wallEntity);
                } else if (y === 0) {
                    if (x === room.doors.top[0] - 1) {
                        frame = [
                            48,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 0),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (x === room.doors.top[room.doors.top.length - 1] + 1) {
                        frame = [
                            32,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(2, 0),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (!room.doors.top.includes(x)) {
                        frame = [
                            0,
                            16
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 0),
                            new (0, _helpers.Vec)(16, 14)
                        ];
                    } else game.ecs.removeEntity(wallEntity);
                } else if (y === game.roomSize.y - 1) {
                    if (x === room.doors.bottom[0] - 1) {
                        frame = [
                            16,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 2),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (x === room.doors.bottom[room.doors.bottom.length - 1] + 1) {
                        frame = [
                            0,
                            32
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(2, 2),
                            new (0, _helpers.Vec)(14, 14)
                        ];
                    } else if (!room.doors.bottom.includes(x)) {
                        frame = [
                            32,
                            16
                        ];
                        hitbox = [
                            new (0, _helpers.Vec)(0, 2),
                            new (0, _helpers.Vec)(16, 14)
                        ];
                    } else game.ecs.removeEntity(wallEntity);
                }
                game.ecs.addComponent(wallEntity, _components.ImageComponent, [
                    game.images["tiles"],
                    new (0, _helpers.Rect)(...frame ?? [
                        0,
                        0
                    ], 16, 16)
                ]);
                game.ecs.addComponent(wallEntity, _components.HitboxComponent, [
                    (0, _helpers.Rect).fromVecs(...hitbox.map((vec)=>vec.scaled(16, game.tileSize)))
                ]);
            }
        }
    }
    return rooms;
};

},{"../components":"hVzNr","../helpers":"e7qJp","./room":"lr0cD","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"lr0cD":[function(require,module,exports) {
/*
 * engine/room.ts
 *
 * This file contains the Room class which represents a single room in the game.
 * The class has a reference to the game object that it belongs to, its
 * position in the game, and a 2D array of tiles. Although every room also
 * has walls, they can be collided so they're implemented as entities.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Room", ()=>Room);
var _components = require("../components");
var _helpers = require("../helpers");
let // an enum to represent the possible floor tiles
Tile;
(function(Tile) {
    Tile[Tile["ShortGrass"] = 0] = "ShortGrass";
    Tile[Tile["TallGrass"] = 1] = "TallGrass";
    Tile[Tile["Flowers1"] = 2] = "Flowers1";
    Tile[Tile["Flowers2"] = 3] = "Flowers2";
})(Tile || (Tile = {}));
class Room {
    tiles = [];
    constructor(game, pos){
        this.game = game;
        this.pos = pos;
        for(let y = 0; y < this.game.roomSize.y; y++){
            this.tiles.push([]); // push an empty tile array
            for(let x = 0; x < this.game.roomSize.x; x++)if (x == 0 || y == 0 || x == this.game.roomSize.x - 1 || y == this.game.roomSize.y - 1) this.tiles[y].push(Tile.ShortGrass); // make it short grass
            else {
                const tile = Math.random() < .8 // 80% chance of short grass
                 ? Tile.ShortGrass : Math.random() < .7 ? Tile.TallGrass : Math.random() < .5 ? Tile.Flowers1 : Tile.Flowers2;
                this.tiles[y].push(tile);
            }
        }
    }
    // renders the room and its entities
    render() {
        // clear the whole canvas
        this.game.ctx.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
        for(let y = 0; y < this.game.roomSize.y; y++)for(let x = 0; x < this.game.roomSize.x; x++){
            const tile = this.tiles[y][x]; // get the tile at the current position
            const tw = this.game.tileSize; // shorthand for tile width
            this.game.ctx.drawImage(this.game.images["tiles"], // source x, y, width, and height
            tile * 16, 0, 16, 16, // destination x, y, width, and height
            x * tw, y * tw, tw, tw);
        }
    }
    // getter function to get the entities which are in this room
    get entities() {
        return this.game.ecs.entities.filter((entity)=>{
            if (!this.game.ecs.hasComponent(entity, _components.PositionComponent)) return false;
            return (0, _helpers.Vec).equal(this.game.ecs.getComponent(entity, _components.PositionComponent).room, this.pos);
        });
    }
}

},{"../components":"hVzNr","../helpers":"e7qJp","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"5rRAM":[function(require,module,exports) {
/* 
 * systems/place.ts
 *
 * This system is responsible for placing items from the player's hands.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PlaceSystem", ()=>PlaceSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
var _helpers = require("../helpers");
class PlaceSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.HandsComponent,
            _components.PositionComponent
        ], (0, _ecs.SystemTrigger).RightClick, (game, entity)=>{
            const position = game.ecs.getComponent(entity, _components.PositionComponent);
            // get the distance between the entity and the mouse
            const dx = game.lastClickPos.x - position.pixels.x;
            const dy = game.lastClickPos.y - position.pixels.y;
            const dist = Math.hypot(dx, dy);
            // if the mouse is more than 5 tiles away, don't do anything
            if (dist > game.tileSize * 5) return;
            const hands = game.ecs.getComponent(entity, _components.HandsComponent);
            if (!hands.allEmpty()) (0, _helpers.attemptPlace)(game, hands, game.lastClickPos.shifted(new (0, _helpers.Vec)(-game.tileSize / 2, -game.tileSize / 2)));
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","../helpers":"e7qJp"}],"gd8Fk":[function(require,module,exports) {
/* 
 * systems/keyup.ts
 *
 * This file contains the system that handles all keybinds that 
 * should only be triggered when a key is released.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "KeyUpSystem", ()=>KeyUpSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
var _helpers = require("../helpers");
class KeyUpSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.ControllableComponent,
            _components.HandsComponent
        ], (0, _ecs.SystemTrigger).KeyUp, (game, entity)=>{
            // use f key to swap items in hands
            if (game.keys["f"]) {
                const hands = game.ecs.getComponent(entity, _components.HandsComponent);
                if (hands.leftHand && !hands.rightHand) {
                    // move item inside the hands component (but this won't alter postion)
                    hands.rightHand = hands.leftHand;
                    hands.leftHand = null;
                    // get position component
                    const rightHandPos = game.ecs.getComponent(hands.rightHand, _components.PositionComponent);
                    // move the entity to the position for the right hand item
                    rightHandPos.pixels = game.rightHandItemPos;
                } else if (!hands.leftHand && hands.rightHand) {
                    hands.leftHand = hands.rightHand;
                    hands.rightHand = null;
                    const leftHandPos = game.ecs.getComponent(hands.leftHand, _components.PositionComponent);
                    leftHandPos.pixels = game.leftHandItemPos;
                } else if (hands.leftHand && hands.rightHand) {
                    const leftHand = hands.leftHand;
                    hands.leftHand = hands.rightHand;
                    hands.rightHand = leftHand;
                    const leftHandPos = game.ecs.getComponent(hands.leftHand, _components.PositionComponent);
                    const rightHandPos = game.ecs.getComponent(hands.rightHand, _components.PositionComponent);
                    leftHandPos.pixels = game.leftHandItemPos;
                    rightHandPos.pixels = game.rightHandItemPos;
                }
            }
            // use the q key to drop the item in the left hand
            if (game.keys["q"]) {
                const hands = game.ecs.getComponent(entity, _components.HandsComponent);
                if (!hands.allEmpty()) {
                    // position of the entity being controlled (the player)
                    const thisPos = game.ecs.getComponent(entity, _components.PositionComponent);
                    /* 
                     * The 0, 1, and -1 values represent how many tiles from the
                     * player the item's new position should be. In the the
                     * order they're in, it will prioritise dropping on the left
                     * side (it will try directly left, then up and left, then
                     * down and left), then the same thing on the right side, 
                     * and if neither of those work, it will try directly above
                     * and below the player.
                     */ for (const y of [
                        0,
                        1,
                        -1
                    ])for (const x of [
                        -1,
                        1,
                        0
                    ]){
                        const dropped = (0, _helpers.attemptPlace)(game, hands, new (0, _helpers.Vec)(thisPos.pixels.x + game.tileSize * x, thisPos.pixels.y + game.tileSize * y));
                        // if the item was dropped, stop trying to drop it elsewhere
                        if (dropped) return;
                    }
                }
            }
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","../helpers":"e7qJp","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"tDHYI":[function(require,module,exports) {
/* 
 * systems/healthbar.ts
 *
 * Renders all the health bars for entities that have a health component.
 * This is done after the main renderer so that the health bars are always
 * on top of the entities and visible.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "HealthBarSystem", ()=>HealthBarSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
class HealthBarSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.HealthComponent,
            _components.PositionComponent
        ], (0, _ecs.SystemTrigger).Tick, (game, entity)=>{
            const healthComponent = game.ecs.getComponent(entity, _components.HealthComponent);
            const positionComponent = game.ecs.getComponent(entity, _components.PositionComponent);
            const renderHealthBar = (colour, amount)=>{
                game.ctx.fillStyle = colour;
                game.ctx.fillRect(positionComponent.pixels.x, positionComponent.pixels.y + game.tileSize + 4, game.tileSize * amount, game.tileSize / 8);
            };
            // render a grey underlay
            renderHealthBar("#ccc", 1);
            // make the health bar go from green to red as the health decreases
            // the math will make sense if you look at a hsl colour picker
            renderHealthBar(`hsl(${healthComponent.health / healthComponent.maxHealth * 100}, 100%, 50%)`, healthComponent.health / healthComponent.maxHealth);
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"1OXJn":[function(require,module,exports) {
/* 
 * systems/hit.ts
 *
 * Contains HitSystem which handles the hitting of entities with the weapon in
 * the player's right hand. If no weapon is present, items can be picked up,
 * but entities with health will not be damaged.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "HitSystem", ()=>HitSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
var _helpers = require("../helpers");
class HitSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.HandsComponent
        ], (0, _ecs.SystemTrigger).Click, (game, entity)=>{
            const handsComponent = game.ecs.getComponent(entity, _components.HandsComponent);
            // try to get weapon entity from right hand, otherwise try left hand or null
            const weaponEntity = game.ecs.hasComponent(handsComponent.rightHand, _components.WeaponComponent) ? handsComponent.rightHand : game.ecs.hasComponent(handsComponent.leftHand, _components.WeaponComponent) ? handsComponent.leftHand : null;
            if (weaponEntity) {
                const weaponComponent = game.ecs.getComponent(weaponEntity, _components.WeaponComponent);
                weaponComponent.holder = entity; // let the weapon system know what's holding the weapon
                weaponComponent.frameCount = 0; // reset frame count
                weaponComponent.totalFrames = 15; // let the animation go for n frames
                // position component of the entity holding the weapon
                const holderPosition = game.ecs.getComponent(entity, _components.PositionComponent);
                const holderCentre = holderPosition.pixels.centred(game.tileSize);
                // 45 degrees above the angle of the mouse
                weaponComponent.startAngle = Math.atan2(game.lastClickPos.y - holderCentre.y, game.lastClickPos.x - holderCentre.x);
                // let the weapon swing 1/6th of a circle
                weaponComponent.swingRadians = Math.PI / 3;
                // move the pivot point 1/5th of a tile away from the holder's centre
                weaponComponent.pivotPointOffset = new (0, _helpers.Vec)(Math.cos(weaponComponent.startAngle) * game.tileSize / 5, Math.sin(weaponComponent.startAngle) * game.tileSize / 5);
            }
            // vector of the tile that was clicked (out of # of tiles, not in pixels)
            const hitTileVec = new (0, _helpers.Vec)(Math.floor(game.lastClickPos.x / game.tileSize), Math.floor(game.lastClickPos.y / game.tileSize));
            const entityPosition = game.ecs.getComponent(entity, _components.PositionComponent);
            // make a temporary hitbox the the size of a tile at the position of the clicked tile
            const tileHitbox = new _components.HitboxComponent((0, _helpers.Rect).fromVecs(new (0, _helpers.Vec)(hitTileVec.x * game.tileSize, hitTileVec.y * game.tileSize), new (0, _helpers.Vec)(game.tileSize, game.tileSize))).getActualHitbox(new _components.PositionComponent(hitTileVec, game.room));
            /* 
             * The array of entities stored in the ECS object has them in an
             * order which means that the entities drawn last (or, the ones
             * that are on top) are at the end of the array, so we reverse it
             * to prioritise hitting/picking up entities that on top of others.
             * We also have to call Array.slice() with no arguments to make a
             * copy of the array because Array.reverse() operates in place.
             */ const entityToHit = game.currentRoom.entities.slice().reverse().find((otherEntity)=>{
                if (!game.ecs.hasComponent(otherEntity, _components.HoldableComponent) && !game.ecs.hasComponent(otherEntity, _components.HealthComponent)) return false;
                // ignore the entity hitting so that it doesn't hit itself
                if (otherEntity === entity) return false;
                const otherEntityPosition = game.ecs.getComponent(otherEntity, _components.PositionComponent);
                // get the distances to the other entity
                const dx = Math.abs(entityPosition.pixels.x - otherEntityPosition.pixels.x);
                const dy = Math.abs(entityPosition.pixels.y - otherEntityPosition.pixels.y);
                const dist = Math.hypot(dx, dy);
                // ignore entities that are too far away for the player to reach (more than 1.5 tiles away)
                if (dist > game.tileSize * 1.8) return false;
                // variable to remember if the entity's hitbox is temporary
                let hasTempHitbox = false;
                // if the entity doesn't have a hitbox, give it a temporary one
                if (!game.ecs.hasComponent(otherEntity, _components.HitboxComponent)) {
                    game.ecs.addComponent(otherEntity, _components.HitboxComponent, [
                        new (0, _helpers.Rect)(0, 0, game.tileSize, game.tileSize)
                    ]);
                    hasTempHitbox = true;
                }
                // get the other entity's hitbox which is now guaranteed to exist
                const otherEntityHitbox = game.ecs.getComponent(otherEntity, _components.HitboxComponent);
                // temporary store the return value of this function so that a temporary hitbox can be removed
                const ret = tileHitbox.overlaps(otherEntityHitbox.getActualHitbox(otherEntityPosition));
                // if the entity has a temporary hitbox, remove it
                if (hasTempHitbox) game.ecs.componentManagers.get(_components.HitboxComponent).removeComponent(otherEntity);
                return ret;
            });
            if (entityToHit && // if there is an entity to hit
            handsComponent.hasSpace() // and there's a free hand
            ) {
                // pick it up by storing it in the hands component and store a reference to where it was stored
                const item = handsComponent.addItem(entityToHit, "left");
                // move the entity so that it's in of the item box
                const itemPosComponent = game.ecs.getComponent(item, _components.PositionComponent);
                itemPosComponent.pixels = handsComponent.leftHand === item ? game.leftHandItemPos : game.rightHandItemPos;
                itemPosComponent.room = game.room;
            }
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","../helpers":"e7qJp","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"2lDf3":[function(require,module,exports) {
/* 
 * engine/itemgen.ts
 *
 * This file contains the addItems function, which takes in a reference to the
 * game object and adds different items into the map (a flat array of rooms
 * generated by the generateMap function in mapgen.ts) based on what level the 
 * player is in.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "addItems", ()=>addItems);
var _components = require("../components");
var _helpers = require("../helpers");
const newItem = (game, room, image, frame)=>{
    const entity = game.ecs.createEntity();
    let pixelPos;
    do pixelPos = new (0, _helpers.Vec)(((0, _helpers.randInt)(2, game.roomSize.x - 3) + Math.random() - .5) * game.tileSize, ((0, _helpers.randInt)(2, game.roomSize.y - 3) + Math.random() - .5) * game.tileSize);
    while (room.entities.some((entity)=>{
        if (!game.ecs.hasComponent(entity, _components.HitboxComponent)) return false;
        const position = game.ecs.getComponent(entity, _components.PositionComponent);
        const hitbox = game.ecs.getComponent(entity, _components.HitboxComponent).getActualHitbox(position);
        return hitbox.overlaps(new _components.HitboxComponent(new (0, _helpers.Rect)(pixelPos.x, pixelPos.y, game.tileSize, game.tileSize)));
    }));
    game.ecs.addComponent(entity, _components.PositionComponent, [
        pixelPos,
        room.pos
    ]);
    game.ecs.addComponent(entity, _components.ImageComponent, [
        image,
        frame
    ]);
    // allow all items to be picked up
    game.ecs.addComponent(entity, _components.HoldableComponent);
    return entity;
};
const addItems = (game)=>{
    for (const room of game.rooms)// 3-5 logs in each room
    for(let i = 0; i < (0, _helpers.randInt)(5, 10); i++){
        const log = newItem(game, room, game.images["items"], new (0, _helpers.Rect)(0, 0, 16, 16));
        game.ecs.addComponent(log, _components.HitboxComponent, [
            new (0, _helpers.Rect)(1, 1, game.tileSize - 1, game.tileSize - 1)
        ]);
    }
    // add a stick in the room the player starts in
    const stick = newItem(game, game.currentRoom, game.images["items"], new (0, _helpers.Rect)(0, 16, 16, 16));
    game.ecs.addComponent(stick, _components.WeaponComponent, [
        5
    ]);
};

},{"../components":"hVzNr","../helpers":"e7qJp","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"el55c":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WeaponSystem", ()=>WeaponSystem);
var _components = require("../components");
var _ecs = require("../engine/ecs");
class WeaponSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.WeaponComponent
        ], (0, _ecs.SystemTrigger).Tick, (game, entity)=>{
            const weapon = game.ecs.getComponent(entity, _components.WeaponComponent);
            if (weapon.frameCount < weapon.totalFrames) {
                weapon.frameCount++;
                const weaponImage = game.ecs.getComponent(entity, _components.ImageComponent);
                const holderPosition = game.ecs.getComponent(weapon.holder, _components.PositionComponent);
                const holderCentre = holderPosition.pixels.centred(game.tileSize);
                // save the current context state
                game.ctx.save();
                // move the context's origin to the center of the holder
                game.ctx.translate(weapon.pivotPointOffset.x + holderCentre.x, weapon.pivotPointOffset.y + holderCentre.y);
                // rotate the context around the top left corner of where it was just moved to
                game.ctx.rotate(weapon.startAngle + weapon.swingRadians * weapon.frameCount / weapon.totalFrames);
                // draw the weapon on the rotated context
                game.ctx.drawImage(weaponImage.image, weaponImage.frame.x, weaponImage.frame.y, weaponImage.frame.width, weaponImage.frame.height, // move the weapon up so it pivots around the bottom left corner of the weapon
                0, -game.tileSize * .8, // scale the weapon down a bit
                game.tileSize * .8, game.tileSize * .8);
                // restore the context to what it was before the weapon was drawn
                game.ctx.restore();
            }
        });
    }
}

},{"../components":"hVzNr","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}]},["83cNV","2G5F2"], "2G5F2", "parcelRequirec2fe")

