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
	  	},

	  

		/* updateTimetable(transports)
		 * Calls processTrains on succesfull response.
		 */
		updateTimetable: function() {
			var url = this.config.apiBase + 'departureList' // List all departures for given station
			var self = this;
			var retry = true;
			var data = {
			  "station": {
			  "type": "STATION",
			  "id": this.config.id,
			  },
			   "time": {
			   },
			   "maxList": this.config.maximumEntries,
			   "useRealtime": this.config.useRealtime,
			   "maxTimeOffset": this.config.maxTimeOffset
			};

		    unirest.post(url)
		    .headers({
		      'Content-Type': 'application/json;charset=UTF-8',
		      'geofox-auth-user': this.config.apiUser,
		      'geofox-auth-signature': self.getSignature(data)
		    })
		    .send(JSON.stringify(data))
		    .end(function (r) {
		    	if (r.error) {
		    		self.updateDom(this.config.animationSpeed);
		    		//console.log(self.name + " : " + r.error);
		    		retry = false;
		    	}
		    	else {
		    		//console.log("body: ", JSON.stringify(r.body));
		    		self.processTrains(r.body);
		    	}

		    	if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : this.config.retryDelay);
				}
		    });
		},

		/* processTrains(data)
		 * Uses the received data to set the various values.
		 */
		processTransports: function(data) {
			this.transports = [];
			var time = data.time.time.split(':')
			hours = time[0];
			mins = time[1];
			var datetime = new Date(this.parseDate(data.time.date));
			datetime.setHours(hours);
			datetime.setMinutes(mins);
			for (var i = 0, count = data.departures.length; i < count; i++) {

				var trains = data.departures[i];

				var departureTime = datetime.setMinutes(datetime.getMinutes() + trains.timeOffset);
				this.trains.push({

					departureTimestamp: trains.timeOffset,
					delay: '',
					name: trains.line.name,
					to: trains.line.direction

				});
			}
			this.loaded = true;
			this.sendSocketNotification("TRANSPORTS", this.transports);
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
		  const self = this;
		  if (notification === 'CONFIG' && this.started == false) {
		    this.config = payload;	     
		    this.started = true;
		    self.scheduleUpdate(this.config.initialLoadDelay);
		    };
		  }
});