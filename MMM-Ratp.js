/* Timetable for Paris local transport Module */

/* Magic Mirror
 * Module: MMM-Ratp
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */
 
Module.register("MMM-Ratp",{

	transports:[],
	lineInfo:"",

	// Define module defaults
	defaults: {
		useRealtime: true,
		updateInterval: 1 * 30 * 1000, // Update 30 secs
		animationSpeed: 2000,
		debugging: true,
		retryDelay: 1 * 10 * 1000,
        initialLoadDelay: 0, // start delay seconds.
	},

	// Define required scripts.
	getStyles: function() {
		return [this.file("css/MMM-Ratp.css")];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		if(this.config.debugging) Log.info("DEBUG mode activated");
		this.sendSocketNotification('CONFIG', this.config);
		this.loaded = false;
		this.updateTimer = null;
	},    
    
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.apiURL === "") {
			wrapper.innerHTML = "Please set the correct API URL in the config of: " + this.name + ".";
			wrapper.className = "dimmed light small ratptransport red";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = "Loading connections ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className ="small";

		// creating title of the timetable
		var rowtitle = document.createElement("th");
		var title = document.createElement("td");
		title.innerHTML = this.lineInfo;
		rowtitle.appendChild(title);
		table.appendChild(rowtitle);

		// adding next schedules
		for (var t in this.transports) {
			var transports = this.transports[t];

			var row = document.createElement("tr");

			var transportTimeCell = document.createElement("td");
			transportTimeCell.innerHTML = transports.time;
			transportTimeCell.className = "align-right bright";
			row.appendChild(transportTimeCell);

			table.appendChild(row);
		}

		return table;
	},

	// using the results retrieved for the API call
	socketNotificationReceived: function(notification, payload) {
		Log.info("Notif:" + notification);
		if (notification === "TRANSPORTS"){
			if(this.config.debugging) {			
				Log.info("Transports arrived");
				Log.info(payload.lineInfo);
				Log.info(payload.transports);
			}
			this.transports = payload.transports;
			this.lineInfo = payload.lineInfo;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	}
});