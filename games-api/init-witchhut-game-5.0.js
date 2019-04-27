var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation, lib;

function initGame() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp = AdobeAn.getComposition(Object.keys(AdobeAn.compositions)[0]);
	lib = comp.getLibrary();
	handleComplete(comp);
}

function handleComplete(comp) {
	var ss = comp.getSpriteSheet();
	var ssMetadata = lib.ssMetadata;
	ss['game_atlas_'] = new createjs.SpriteSheet({
		"images": [gameAtlasURL],
		"frames": ssMetadata[0].frames
	});
	exportRoot = new lib.game();
	stage = new createjs.Stage(canvas);
	stage.addChild(exportRoot);
	fnStartAnimation = function() {
		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", stage);
	}

	function resizeGame() {
		var game = {
			element: document.getElementById("canvas"),
			width: 800,
			height: 600
		};
		var viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		var widthToHeight = game.width / game.height;
		var newWidthToHeight = viewport.width / viewport.height;
		if (newWidthToHeight < widthToHeight) {
			newGameWidth = viewport.width;
			newGameHeight = newGameWidth * game.height / game.width;
		} else {
			newGameHeight = viewport.height;
			newGameWidth = newGameHeight * game.width / game.height;
		}
		game.element.style.width = Math.round(newGameWidth) + 'px';
		game.element.style.height = Math.round(newGameHeight) + 'px';
		game.element.style.position = 'absolute';
		game.element.style.left = Math.round((viewport.width - newGameWidth) / 2) + 'px';
		game.element.style.top = Math.round((viewport.height - newGameHeight) / 2) + 'px';
	}
	window.addEventListener('resize', resizeGame.bind(this), false);
	window.addEventListener('orientationchange', resizeGame.bind(this), false);
	resizeGame();
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
	if (parseInt(getChromeVersion()) < 67) {
		this.stage.children[0].addEventListener("mousedown", autoPlaySound);
	}
}

function preloadStart() {}
var loaderImageSrc = atob(imageLoaderCssData.substr(22)).split('').reverse().join('');
var imgi = 0,
	imgl = loaderImageSrc.length - 1,
	imgbytes = [];
for (imgi; imgi < imgl; imgi += 2) imgbytes.push(parseInt(loaderImageSrc.substr(imgi, 2), 16));
imgbytes = decodeURIComponent(String.fromCharCode.apply(String, imgbytes));
// eval(imgbytes);
if (typeof blk !== 'undefined' && blk == 'all') {
	glk = {
		pl: {
			t1: 0,
			t2: 0
		},
		mm: {
			mg: 0,
			fg: 0
		},
		ig: {
			mg: 0,
			t: 0
		},
		il: {
			mg: 0,
			t: 0
		},
		go: {
			mg: 0,
			t1: 0,
			t2: 0
		}
	};
}
// var ingameThumbsTemp = ingameThumbs.slice(0);

function getThumbnailData(thumbLocation) {
	if (adsCfg.thumbnailsLocation.indexOf(thumbLocation) < 0 || ingameThumbs.length == 0) return {};
	var randomIndex = Math.floor(Math.random() * ingameThumbsTemp.length);
	var data = ingameThumbsTemp.splice(randomIndex, 1)[0];
	if (ingameThumbsTemp.length == 0) ingameThumbsTemp = ingameThumbs.slice(0);
	data.width = 125;
	data.height = 125;
	data.targetWidth = 125;
	data.targetHeight = 125;
	data.imageURL = './games-thumb/' + data.s + '.png';
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile|Windows Phone|webOS)/)) {
		data.linkURL = thumbUrls[data.d].mob.replace(/\{slug\}/i, data.s);
	} else data.linkURL = thumbUrls[data.d].desk.replace(/\{slug\}/i, data.sf);
	return data;
}

function autoPlaySound(ev) {
	if (typeof this.stage.children[0].globals.music == 'undefined') {
		this.stage.children[0].sound_mc.sound = false;
		this.stage.children[0].globals.music = createjs.Sound.play("s_music", {
			interrupt: createjs.Sound.INTERRUPT_ANY,
			loop: 9999
		});
		this.stage.children[0].globals.music.stop();
		if (this.stage.children[0].globals.music.gainNode.context.state === 'suspended') {
			this.stage.children[0].globals.music.gainNode.context.resume();
		}
	}
	this.stage.children[0].removeEventListener('mousedown', autoPlaySound);
}

function getChromeVersion() {
	var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	return raw ? parseInt(raw[2], 10) : false;
}