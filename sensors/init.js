load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load("api_dht.js");

let button = Cfg.get('pins.button');
let topic = '/devices/' + Cfg.get('device.id') + '/events';


let mydht = DHT.create(2, DHT.DHT11);

// Publish to MQTT topic on a button press. Button is wired to GPIO pin 0
Timer.set(5000, Timer.REPEAT, function() {
  let message = JSON.stringify({ temp: mydht.getTemp(), humidity: mydht.getHumidity() });
  let ok = MQTT.pub(topic, message, 1);
}, null);



// // Monitor network connectivity.
// Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
//   let evs = '???';
//   if (ev === Net.STATUS_DISCONNECTED) {
//     evs = 'DISCONNECTED';
//   } else if (ev === Net.STATUS_CONNECTING) {
//     evs = 'CONNECTING';
//   } else if (ev === Net.STATUS_CONNECTED) {
//     evs = 'CONNECTED';
//   } else if (ev === Net.STATUS_GOT_IP) {
//     evs = 'GOT_IP';
//   }
// }, null);
