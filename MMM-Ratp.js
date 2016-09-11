/* Timetable for Paris local transport Module */

/* Magic Mirror
 * Module: MMM-Ratp
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */

Module.register("MMM-Ratp",{

	// Define module defaults
	defaults: {
		useRealtime: true,
		updateInterval: 1 * 60 * 1000, // Update every minute.
		animationSpeed: 2000,
        initialLoadDelay: 0, // start delay seconds.
		apiURL: 'http://api-ratp.pierre-grimaud.fr/v2/bus/176/stations/5138?destination=pont+de+neuilly', // more info about API documentation : https://github.com/pgrimaud/horaires-ratp-api
	},

	// Define required scripts.
	getStyles: function() {
		return ["css/MMM-Ratp.css", "font-awesome.css"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.sendSocketNotification('CONFIG', this.config);
        this.transports = [];
		this.loaded = false;
		this.updateTimer = null;

	},    
    
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.apiURL === "") {
			wrapper.innerHTML = "Please set the correct API URL: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = "Loading connections ...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = "small";

		for (var t in this.transports) {
			var transports = this.transports[t];

			var row = document.createElement("tr");
			table.appendChild(row);

			var depCell = document.createElement("td");
			depCell.className = "departuretime";
			if (trains.departureTimestamp == 0) {
				depCell.innerHTML = "now";
			}
			else {
			depCell.innerHTML = "in " + trains.departureTimestamp + " min";
		    }

			var transportNameCell = document.createElement("td");
			transportNameCell.innerHTML = trains.name;
			transportNameCell.className = "align-right bright";
			row.appendChild(transportNameCell);
			
		}

		return table;
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === "TRANSPORTS"){
			Log.info("Transports arrived");
			this.transports = payload;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	}
});