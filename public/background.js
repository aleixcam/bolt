'use strict';
const { ipcRenderer } = require('electron');

window.onload = function() {
	ipcRenderer.on('task:run', (event, channel, params) => {
		channel = channel.split(':');
		const task = require(`./js/tasks/${channel[0]}`)[channel[1]]
		const args = Object.values(params)
		task(...args, response => {
			ipcRenderer.send('task:response', response);
			console.log('end');
		})
	})
}
