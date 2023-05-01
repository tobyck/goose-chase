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
})({"8m48g":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 61200;
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
var _ecs = require("./engine/ecs");
var _mapgen = require("./engine/mapgen");
var _util = require("./util");
class Game {
    ecs = new (0, _ecs.ECS)(this);
    images = {};
    constructor(canvas, level){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.level = level;
        // level 1: 1x1
        // level 2: 2x1
        // level 3: 2x2
        // level 4: 3x2
        // ...
        this.roomCount = new (0, _util.Vec)(Math.ceil(level / 2), Math.ceil(level / 2));
        if (level % 2 === 0) this.roomCount.x++;
        // put the character in the middle of the map
        this.room = new (0, _util.Vec)(Math.floor(this.roomCount.x / 2), Math.floor(this.roomCount.y / 2));
        // size the rooms to have a roughly even number of tiles with different aspect ratios
        this.roomSize = new (0, _util.Vec)(null, null);
        this.roomSize.y = Math.floor(10 * (innerHeight / innerWidth + 1));
        this.tileWidth = Math.floor(innerHeight / this.roomSize.y);
        this.roomSize.x = Math.floor(innerWidth / this.tileWidth);
        // size the canvas to fit a room
        this.canvas.width = this.roomSize.x * this.tileWidth;
        this.canvas.height = this.roomSize.y * this.tileWidth;
        // turn off anti-aliasing
        this.ctx.imageSmoothingEnabled = false;
        // pre-load images
        const files = [
            "tiles"
        ]; // list of filenames without extension
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
            // generate the rooms using the function in mapgen.ts
            this.rooms = (0, _mapgen.generateMap)(this);
            // start the game loop
            this.gameLoop();
        });
    }
    // re-render the whole game every frame using requestAnimationFrame
    gameLoop() {
        // clear the whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // find the current room and render 
        this.currentRoom.render();
        // update all systems triggerd by rendering
        this.ecs.systemManager.updateSystems((0, _ecs.SystemTrigger).Render);
        // request the next frame
        requestAnimationFrame(()=>this.gameLoop());
    }
    // getter function to find the current room
    get currentRoom() {
        return this.rooms.find((room)=>(0, _util.Vec).equal(room.pos, this.room));
    }
}
exports.default = Game;
const game = new Game(document.querySelector("canvas"), 1);

},{"./engine/mapgen":"lyfm3","./util":"9OSfS","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","./engine/ecs":"bTIAG"}],"lyfm3":[function(require,module,exports) {
/* 
 * engine/mapgen.ts
 *
 * This file is responsible for generating the map. The Room object comes with
 * the floor tiles, but the generateMap adds walls and other entities like food.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "generateMap", ()=>generateMap);
var _components = require("../components/components");
var _render = require("../systems/render");
var _util = require("../util");
var _room = require("./room");
const generateMap = (game)=>{
    const rooms = [];
    for(let y = 0; y < game.roomCount.y; y++)for(let x = 0; x < game.roomCount.x; x++)rooms.push(new (0, _room.Room)(game, new (0, _util.Vec)(x, y)));
    /* TEST */ const wallEntity = game.ecs.createEntity();
    game.ecs.addComponent(wallEntity, _components.PositionComponent, [
        new (0, _util.Vec)(0, 0),
        new (0, _util.Vec)(0, 0)
    ]);
    game.ecs.addComponent(wallEntity, _components.ImageComponent, [
        game.images["tiles"],
        0,
        48,
        16,
        16
    ]);
    game.ecs.systemManager.addSystem(new (0, _render.RenderSystem)());
    /* END TEST */ return rooms;
};

},{"../components/components":"jPTTN","../systems/render":"lpuAS","../util":"9OSfS","./room":"lr0cD","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"jPTTN":[function(require,module,exports) {
// export all components from this file to make importing them easier
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PositionComponent", ()=>(0, _position.PositionComponent));
parcelHelpers.export(exports, "ImageComponent", ()=>(0, _image.ImageComponent));
var _position = require("./position");
var _image = require("./image");

},{"./position":"kIFaG","./image":"ia3WO","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"kIFaG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "PositionComponent", ()=>PositionComponent);
var _ecs = require("../engine/ecs");
class PositionComponent extends (0, _ecs.Component) {
    constructor(position, room){
        super();
        this.position = position;
        this.room = room;
    }
}

},{"../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"bTIAG":[function(require,module,exports) {
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
// system class
// when a system is triggered it will use the update method to update 
// all entities with the required components
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
    SystemTrigger[SystemTrigger["Render"] = 0] = "Render";
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
        for (const system of systems)for (const entity of entities){
            // assume the entity has all required components until proven otherwise
            let hasRequiredComponents = true;
            for (const requiredComponent of system.requiredComponents)// if the entity doesn't have a required component, it shouldn't be updated
            if (!this.game.ecs.hasComponent(entity, requiredComponent)) {
                hasRequiredComponents = false;
                break;
            }
            // update the entity if it has all required components
            if (hasRequiredComponents) system.update(this.game, entity);
        }
    }
}
class ECS {
    entities = [];
    componentManagers = new Map();
    constructor(game){
        this.systemManager = new SystemManager(game);
    }
    createEntity() {
        this.entities.push(this.entities.length);
        return this.entities.length - 1;
    }
    removeEntity(entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
    }
    hasComponent(entity, component) {
        return this.componentManagers.get(component).getComponent(entity) !== undefined;
    }
    addComponent(entity, component, args) {
        if (!this.componentManagers.has(component)) this.componentManagers.set(component, new ComponentManager());
        this.componentManagers.get(component).addComponent(entity, new component(...args));
    }
    getComponent(entity, component) {
        return this.componentManagers.get(component).getComponent(entity);
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"b4oyH":[function(require,module,exports) {
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

},{}],"ia3WO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ImageComponent", ()=>ImageComponent);
var _ecs = require("../engine/ecs");
class ImageComponent extends (0, _ecs.Component) {
    constructor(image, sx, sy, sw, sh){
        super();
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }
}

},{"../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"lpuAS":[function(require,module,exports) {
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
var _components = require("../components/components");
var _ecs = require("../engine/ecs");
class RenderSystem extends (0, _ecs.System) {
    constructor(){
        super([
            _components.PositionComponent,
            _components.ImageComponent
        ], (0, _ecs.SystemTrigger).Render, (game, entity)=>{
            const positionComponent = game.ecs.getComponent(entity, _components.PositionComponent);
            const imageComponent = game.ecs.getComponent(entity, _components.ImageComponent);
            game.ctx.drawImage(imageComponent.image, imageComponent.sx, imageComponent.sy, imageComponent.sw, imageComponent.sh, positionComponent.position.x, positionComponent.position.y, game.tileWidth, game.tileWidth);
        });
    }
}

},{"../components/components":"jPTTN","../engine/ecs":"bTIAG","@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"9OSfS":[function(require,module,exports) {
/* 
 * util.ts
 *
 * This file contains useful miscellaneous functions and 
 * classes used throughout the codebase.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vec", ()=>Vec);
class Vec {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH"}],"lr0cD":[function(require,module,exports) {
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
var _components = require("../components/components");
var _util = require("../util");
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
            for(let x = 0; x < this.game.roomSize.x; x++)if (x === 0 || y === 0 || x === this.game.roomSize.x - 1 || y === this.game.roomSize.y - 1) this.tiles[y].push(Tile.ShortGrass);
            else {
                const tile = Math.random() < .8 // 80% chance of short grass
                 ? Tile.ShortGrass : Math.random() < .7 ? Tile.TallGrass : Math.random() < .5 ? Tile.Flowers1 : Tile.Flowers2;
                this.tiles[y].push(tile);
            }
        }
    }
    // renders the room and its entities
    render() {
        for(let y = 0; y < this.game.roomSize.y; y++)for(let x = 0; x < this.game.roomSize.x; x++){
            const tile = this.tiles[y][x]; // get the tile at the current position
            const tw = this.game.tileWidth; // shorthand for tile width
            this.game.ctx.drawImage(this.game.images["tiles"], // source x, y, width, and height
            tile * 16, 0, 16, 16, // destination x, y, width, and height
            x * tw, y * tw, tw, tw);
        }
    }
    // getter function to get the entities which are in this room
    // (exists only to get around a circular dependency)
    get entities() {
        return this.game.ecs.entities.filter((entity)=>(0, _util.Vec).equal(this.game.ecs.getComponent(entity, _components.PositionComponent).room, this.pos));
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"b4oyH","../util":"9OSfS","../components/components":"jPTTN"}]},["8m48g","2G5F2"], "2G5F2", "parcelRequirec2fe")

