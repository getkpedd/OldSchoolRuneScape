AdventureScreen = new ScreenContainer({
	classBase: 'adventure-screen',
	targetDiv: '.adventure',

	screens: [
		new ScreenDef({
			name: 'map-select',
			createHtml: mapSelectHtml
		}),
		new ScreenDef({
			name: 'field'
		}),
		new ScreenDef({
			name: 'store',
			html: getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave') +
				'<div class="recipes"></div>'
		}),
		new ScreenDef({
			name: 'shrine',
			createHtml: shrineHtml
		})
	],

	adventures: {},

	preInit: function() {
		this.adventures = loadAdventures();
	},

	onScreenSet: function(name) {
		if (!this.isOpen('field') && name == 'field') {
			EnemyManager.resetField();
		}

		this.curScreen = name;
	}
});
AdventureScreen.toSave = ['adventures'];
AdventureScreen.update = function() {
	$('#map-button').toggle(this.hasBeat('adv0'));
	$('#shrine-button').toggle(this.hasBeat('adv2'));
	for (var i in this.adventures) {
		this.adventures[i].update();
	}
};
AdventureScreen.getAdventure = function(name) {
	for (var i in this.adventures) {
		var adv = this.adventures[i];
		if (adv.name == name) {
			return adv;
		}
	}

	return null;
};
AdventureScreen.hasBeat = function(name) {
	var adv = this.getAdventure(name);
	return adv && adv.hasBeat;
};
AdventureScreen.startAdventure = function(name) {
	var adv = this.getAdventure(name);
	EnemyManager.curArea = adv;
	this.setScreen('field');
};
AdventureScreen.increasePower = function(name) {
	var adv = this.getAdventure(name);
	if (Player.gold >= adv.powerUpCost()) {
		Player.gold -= adv.powerUpCost();
		adv.power++;
	}
};
AdventureScreen.decreasePower = function(name) {
	var adv = this.getAdventure(name);
	if (adv.power > 0) {
		adv.power--;
	}
};

function AdventureDef(data) {
	this.toSave = ['hasBeat', 'power'];
	this.prereq = data.prereq || null;
	this.name = data.name || '';
	this.displayName = data.displayName || '';
	this.levels = data.levels || [1];
	this.enemies = data.enemies || [];
	this.spawnCountLo = data.spawnCountLo || 3;
	this.spawnCountHi = data.spawnCountHi || 5;
	this.powerCost = data.powerCost || 100;

	this.hasBeat = false;
	this.power = 0;

	this.update = function() {
		$('#' + this.name + '-button').toggle(this.isAvailable());
		var powId = '#' + this.name + '-power';
		if (this.isAvailable()) {
			$(powId).show();
			$(powId + '-count').text(formatNumber(this.power));
			$(powId + '-dec').toggle(this.power > 0);
			$(powId + '-inc-cost').text(formatNumber(this.powerUpCost()));
		}
		else {
			$(powId).hide();
		}
	};

	this.isAvailable = function() {
		return !this.prereq || AdventureScreen.hasBeat(this.prereq);
	};

	this.getLevel = function(areaIndex) {
		var baseLevel = this.levels[areaIndex] || 1;
		return Math.ceil(baseLevel * (1 + 0.25 * this.power) + 2.5 * this.power);
	};

	this.powerUpCost = function() {
		return this.powerCost * Math.pow(this.power + 1, 2);
	};
}

function mapSelectHtml() {
	var html = getButtonHtml("AdventureScreen.setScreen('store')", 'Store') + ' ' +
		getButtonHtml("AdventureScreen.setScreen('shrine')", 'Shrine', 'shrine-button') + '<br>';
	for (var key in AdventureScreen.adventures) {
		var adv = AdventureScreen.adventures[key];
		html += getButtonHtml("AdventureScreen.startAdventure('" + adv.name + "')",
			adv.displayName, adv.name + '-button') + ' ';
	}
	return html;
}

function shrineHtml() {
	var html = getButtonHtml("AdventureScreen.setScreen('map-select')", 'Leave');
	for (var key in AdventureScreen.adventures) {
		var adv = AdventureScreen.adventures[key];
		var id = adv.name + '-power';
		html += '<div id="' + id + '">' +
			getButtonHtml("AdventureScreen.decreasePower('" + adv.name + "')",
				'Decrease Power', id + '-dec') +
			' <span>' + adv.displayName + ' : Power <span id="' + id + '-count"></span></span> ' +
			getButtonHtml("AdventureScreen.increasePower('" + adv.name + "')",
				'Increase Power<br><span id="' + id + '-inc-cost"></span>' +
				getIconHtml('gold'), id + '-inc') +
			'</div>';
	}
	return html;
}
