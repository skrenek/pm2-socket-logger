
const io = require('pmx')
const dgram = require('dgram')
const pm2 = require('pm2')

/**
 *    Module system documentation
 *       http://bit.ly/1hnpcgu
 *
 *   Start module in development mode
 *          $ cd to my-module
 *          $ pm2 install .
 *
 *  Official modules are published here
 *      https://github.com/pm2-hive
 */

/**
 *           Module Entry Point
 *
 *  We first initialize the module by calling
 *         pmx.initModule({}, cb);
 *
 *
 * More options: http://bit.ly/1EpagZS
 *
 */
io.initModule({}, function(err, conf) {

  if (err) {
    console.error('error on initalizing pm2-socket-logger', err.message);
  }
  // console.log('pm2-socket-logger conf', conf)
  const socket = dgram.createSocket('udp4')
  const options = {
    socketLogHost: conf.socketLogHost || '127.0.0.1',
    socketLogPort: conf.socketLogPort || 514,
  }

  console.log('pm2-socket-logger configured for', options.socketLogHost, options.socketLogPort)

  function log(source, data) {
    // console.log('sending msg', data, 'to', options.socketLogPort)
    socket.send(Buffer.from(`[${data.process.name}] ${data.data}`, 'utf-8'), options.socketLogPort, options.socketLogHost)
  }

  pm2.launchBus((err, bus) => {
    if (err) {
      console.error('error on launching pm2 bus', err.message)
    }

    bus.on('log:err', data => {
      if (data.process.name !== 'pm2-socket-logger') {
        log('stderr', data)
      }
    });

    bus.on('log:out', data => {
      if (data.process.name !== 'pm2-socket-logger') {
        log('stdout', data)
      }
    })

    bus.on('close', () => {
      pm2.disconnectBus();
      if (socket) {
        socket.close()
      }
    });
  })
})
