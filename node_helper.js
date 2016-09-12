/* Timetable for Paris local transport Module */

/* Magic Mirror
 * Module: MMM-Ratp
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const forge = require('node-forge');
const unirest = require('unirest');

module.exports = NodeHelper.create({

		start: function () {
	    		this.started = false;
			console.log("NodeH started");
	  	},

	  

		/* updateTimetable(transports)
		 * Calls processTransports on succesfull response.
		 */
		updateTimetable: function() {
			var url = this.config.apiURL;
			var self = this;
			var retry = false;

			if(this.config.debugging) {
				console.log("Function updateTimeTable");
			}

		    unirest.get(url)
		    .end(function (r) {
		    	if (r.error) {
		    		console.log(self.name + " : " + r.error);
		    		retry = false;
		    	}
		    	else {
		    		// console.log("body: ", JSON.stringify(r.body));
		    		self.processTransports(r.body);
		    	}

		    	if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : this.config.retryDelay);
				}
		    });
		},

		/* processTransports(data)
		 * Uses the received data to set the various values.
		 */
		processTransports: function(data) {
			if(this.config.debugging) {
				console.log("Processing transports:" + data);
			}

			this.transports = [];
		
		    	this.lineInfo =  data.response.informations.type + " " + data.response.informations.line + " (vers " + data.response.informations.destination.name + ")";
			for (var i = 0, count = data.response.schedules.length; i < count; i++) {

				var nextTransport = data.response.schedules[i];

				this.transports.push({
					name: nextTransport.destination,
					time: nextTransport.message
				});
			}
			this.loaded = true;
			this.sendSocketNotification("TRANSPORTS", {transports:this.transports, lineInfo: this.lineInfo});
		},

		/* scheduleUpdate()
		 * Schedule next update.
		 * argument delay number - Millis econds before next update. If empty, this.config.updateInterval is used.
		 */
		scheduleUpdate: function(delay) {
			var nextLoad = this.config.updateInterval;
			if (typeof delay !== "undefined" && delay >= 0) {
				nextLoad = delay;
			}

			var self = this;
			clearTimeout(this.updateTimer);
			this.updateTimer = setTimeout(function() {
				self.updateTimetable();
			}, nextLoad);
		},

		socketNotificationReceived: function(notification, payload) {
			console.log("Notif received: " + notification);
			const self = this;
		  	if (notification === 'CONFIG' && this.started == false) {
		    	this.config = payload;
		    	this.started = true;
		    	self.scheduleUpdate(this.config.initialLoadDelay);
		    }
			if(this.config.debugging) {
				console.log("Notif received: " + notification);
				console.log(payload);
			}
		}
});