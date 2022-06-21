"use strict";
/*
With thanks, https://github.com/FormidableLabs/react-game-kit/blob/master/src/native/utils/game-loop.js
*/
Object.defineProperty(exports, "__esModule", { value: true });
class DefaultTimer {
    constructor() {
        this.loop = (time = 0) => {
            if (this.loopId) {
                this.subscribers.forEach((callback) => {
                    callback(time);
                });
            }
            this.loopId = requestAnimationFrame(this.loop);
        };
        this.subscribers = [];
        this.loopId = null;
    }
    start() {
        if (!this.loopId) {
            this.loop();
        }
    }
    stop() {
        if (this.loopId) {
            cancelAnimationFrame(this.loopId);
            this.loopId = null;
        }
    }
    subscribe(callback) {
        if (this.subscribers.indexOf(callback) === -1) {
            this.subscribers.push(callback);
        }
    }
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((s) => s !== callback);
    }
}
exports.default = DefaultTimer;
