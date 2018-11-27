window.ipcRenderer = require('electron').ipcRenderer
window.Nucleus = require('electron-nucleus')('5bf7104364ad4a01c40ce731')

// Custom methods
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
