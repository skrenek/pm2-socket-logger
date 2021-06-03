# pm2-socket-logger

PM2 module to pass log messages through to a UDP socket connection.

## Installation

`pm2 install pm2-socket-logger`

## Configuration

Config variables:

* socketLogHost (default 127.0.0.1)
* socketLogPort (default 514)

Customize config variables:

See https://pm2.keymetrics.io/docs/advanced/pm2-module-system/#changing-values

Examples:
`pm2 set pm2-socket-logger:socketLogHost example.com`
`pm2 set pm2-socket-logger:socketLogPort 1234`