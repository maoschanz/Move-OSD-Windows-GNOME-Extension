
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('move-osd-windows');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

//------------------------------------------------------------------------------

const OSDSettingsWidget = new GObject.Class({
	Name: 'OSD.Prefs.Widget',
	GTypeName: 'OSDPrefsWidget',
	Extends: Gtk.Grid,

	_init: function() {
		this.parent({
			margin: 25,
			row_spacing: 30,
			column_spacing: 20,
			halign: Gtk.Align.CENTER,
		});
		this.SETTINGS = ExtensionUtils.getSettings();

		//----------------------------------------------------------------------

		let horizontalPercentageLabel = new Gtk.Label({
			label: _("Horizontal position (percentage)"),
			use_markup: true,
			halign: Gtk.Align.END
		});
		this.attach(horizontalPercentageLabel, 0, 0, 1, 1);

		let horizontalPercentage = new Gtk.SpinButton();
		horizontalPercentage.set_range(-60, 60);
		horizontalPercentage.set_value(0);
		horizontalPercentage.set_value(this.SETTINGS.get_int('horizontal'));
		horizontalPercentage.set_increments(1, 2);

		horizontalPercentage.connect('value-changed', Lang.bind(this, function(w) {
			var value = w.get_value_as_int();
			this.SETTINGS.set_int('horizontal', value);
		}));

		this.attach(horizontalPercentage, 1, 0, 1, 1);

		//----------------------------------------------------------------------

		let verticalPercentageLabel = new Gtk.Label({
			label: _("Vertical position (percentage)"),
			use_markup: true,
			halign: Gtk.Align.END
		});
		this.attach(verticalPercentageLabel, 0, 1, 1, 1);

		let verticalPercentage = new Gtk.SpinButton();
		verticalPercentage.set_range(-110, 110);
		verticalPercentage.set_value(70);
		verticalPercentage.set_value(this.SETTINGS.get_int('vertical'));
		verticalPercentage.set_increments(1, 2);

		verticalPercentage.connect('value-changed', Lang.bind(this, function(w) {
			var value = w.get_value_as_int();
			this.SETTINGS.set_int('vertical', value);
		}));

		this.attach(verticalPercentage, 1, 1, 1, 1);

		//----------------------------------------------------------------------

		let hideSwitchLabel = new Gtk.Label({
			label: _("Hide totally OSD windows"),
			use_markup: true,
			halign: Gtk.Align.END
		});
		this.attach(hideSwitchLabel, 0, 2, 1, 1);

		let hideSwitch = new Gtk.Switch();
		hideSwitch.set_state(false);
		hideSwitch.set_halign(Gtk.Align.START)
		hideSwitch.set_state(this.SETTINGS.get_boolean('hide'));

		hideSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			this.SETTINGS.set_boolean('hide', widget.active);
		}));

		this.attach(hideSwitch, 1, 2, 1, 1);
	}
});

//------------------------------------------------------------------------------

function init() {
	ExtensionUtils.initTranslations();
}

// This is like the "enable" in extension.js : something called each time the
// user tries to access the settings' window
function buildPrefsWidget() {
	let widget = new OSDSettingsWidget();
	widget.show_all();

	return widget;
}

