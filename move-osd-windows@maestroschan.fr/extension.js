// gpl v3

const Main = imports.ui.main;
const OsdWindow = imports.ui.osdWindow;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
	ExtensionUtils.initTranslations();
}

//------------------------------------------------------------------------------

function injectToFunction(parent, name, func) {
	let origin = parent[name];
	parent[name] = function() {
		let ret;
		ret = origin.apply(this, arguments);
			if (ret === undefined)
				ret = func.apply(this, arguments);
			return ret;
		}
	return origin;
}

function removeInjection(object, injection, name) {
	if (injection[name] === undefined)
		delete object[name];
	else
		object[name] = injection[name];
}

let injections=[];

//------------------------------------------------------------------------------

function enable() {
	let settings = ExtensionUtils.getSettings();

	injections['show'] = injectToFunction(
		OsdWindow.OsdWindow.prototype,
		'show',
		function() {
			if(settings.get_boolean('hide')) {
				this.visible = false;
			} else {
				this.visible = true;
				let monitor = Main.layoutManager.monitors[this._monitorIndex];
				let h_percent = settings.get_int('horizontal');
				let v_percent = settings.get_int('vertical');

				this._box.translation_x = h_percent * monitor.width / 100;
				this._box.translation_y = v_percent * monitor.height / 100;
			}
		}
	);
}

function disable() {
	let arrayOSD = Main.osdWindowManager._osdWindows;

	for(let i = 0; i < arrayOSD.length; i++) {
		arrayOSD[i]._relayout();
		arrayOSD[i]._box.translation_x = 0;
	}

	removeInjection(OsdWindow.OsdWindow.prototype, injections, 'show');
}

