module.exports = GridEngine = {
	domain: 'http://localhost:8000',
	// domain: 'http://10.0.0.21:8000',
	// domain: 'http://www.showgridnashville.com',

	cells: null,		// Cells in table row

	MIN_NUM_CELLS: 2, 	// Min number of cells in row
	MAX_NUM_CELLS: 7,	// Max number of cells in row

	V_EM_UNIT_LG: 12,		// 'em' value of venue cell
	V_EM_UNIT_SM: 10,		// 'em' value of venue cell
	S_EM_UNIT: 9,		// 'em' value of show cells
	F_PX_UNIT: 16,		// 'px' value of default font

	V_WIDTH: null,	// venue cell width
	S_WIDTH: null,	// min show cell width


	init: function() {
		this.createCellWidthConstants();		// Sets cell width constants
		
		this.cells = this.calculateCellCount();

		this.addListeners(window, "resize");	// Add grid adjustment listeners
	},

	getCellCount: function () {
		return this.cells;
	},

	createCellWidthConstants: function() {
		if (window.innerWidth <= 320)
			this.V_WIDTH = this.V_EM_UNIT_SM * this.F_PX_UNIT;	// calc venue column min/max-width for SM
		else 
			this.V_WIDTH = this.V_EM_UNIT_LG * this.F_PX_UNIT;	// calc venue column min/max-width for LG

		this.S_WIDTH = this.S_EM_UNIT * this.F_PX_UNIT;	// calc show cell min-width
	},

	addListeners: function(ele, events) {
		var e = events.split(" ");

		for (var i = 0, len = e.length; i < len; i++) {
			ele.addEventListener(e[i], GridEngine.gridAdjust);
		}
	},

	gridAdjust: function(e) {
		GridEngine.cells = GridEngine.calculateCellCount();
	},

	calculateCellCount: function() {
		var wWidth = window.innerWidth,		// Window width
			rWidth = GridEngine.V_WIDTH,				// Base row width (constant venue width)
			count = -1;						// Count of number of cells

		while (rWidth < wWidth) {
			rWidth += GridEngine.S_WIDTH;

			count++;
		}

		return (count > GridEngine.MAX_NUM_CELLS) ? 7 : count;
	}
};