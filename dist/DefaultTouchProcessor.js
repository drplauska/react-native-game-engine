"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const DefaultTouchProcessor = ({ triggerPressEventBefore = 200, triggerLongPressEventAfter = 700, moveThreshold = 0, }) => {
    return (touches) => {
        const touchStart = new rxjs_1.Subject().pipe((0, operators_1.map)((e) => ({ id: e.identifier, type: "start", event: e })));
        const touchMove = new rxjs_1.Subject().pipe((0, operators_1.map)((e) => ({ id: e.identifier, type: "move", event: e })));
        const touchEnd = new rxjs_1.Subject().pipe((0, operators_1.map)((e) => ({ id: e.identifier, type: "end", event: e })));
        const touchPress = touchStart.pipe((0, operators_1.mergeMap)((e) => touchEnd.pipe((0, operators_1.first)((x) => x.id === e.id), (0, operators_1.timeoutWith)(triggerPressEventBefore, rxjs_1.EMPTY))), (0, operators_1.map)((e) => (Object.assign(Object.assign({}, e), { type: "press" }))));
        const touchMoveDelta = (0, rxjs_1.merge)(touchStart, touchMove, touchEnd).pipe((0, operators_1.groupBy)((e) => e.id), (0, operators_1.mergeMap)((group) => group.pipe((0, operators_1.pairwise)(), (0, operators_1.map)(([e1, e2]) => {
            if (e1.type !== "end" && e2.type === "move") {
                return {
                    id: group.key,
                    type: "move",
                    event: e2.event,
                    delta: {
                        locationX: e2.event.locationX - e1.event.locationX,
                        locationY: e2.event.locationY - e1.event.locationY,
                        pageX: e2.event.pageX - e1.event.pageX,
                        pageY: e2.event.pageY - e1.event.pageY,
                        timestamp: e2.event.timestamp - e1.event.timestamp,
                    },
                };
            }
        }), (0, operators_1.filter)((e) => {
            if (!e) {
                return false;
            }
            return Math.pow(e.delta.pageX, 2) + Math.pow(e.delta.pageY, 2) > Math.pow(moveThreshold, 2);
        }))));
        const longTouch = touchStart.pipe((0, operators_1.mergeMap)((e) => (0, rxjs_1.of)(e).pipe((0, operators_1.delay)(triggerLongPressEventAfter), (0, operators_1.takeUntil)((0, rxjs_1.merge)(touchMoveDelta, touchEnd).pipe((0, operators_1.first)((x) => (x === null || x === void 0 ? void 0 : x.id) === e.id))))), (0, operators_1.map)((e) => (Object.assign(Object.assign({}, e), { type: "long-press" }))));
        const subscriptions = [
            touchStart,
            touchEnd,
            touchPress,
            longTouch,
            touchMoveDelta,
        ].map((x) => x.subscribe((y) => touches.push(y)));
        return {
            process(type, event) {
                switch (type) {
                    case "start":
                        touchStart.next(event);
                        break;
                    case "move":
                        touchMove.next(event);
                        break;
                    case "end":
                        touchEnd.next(event);
                        break;
                }
            },
            end() {
                subscriptions.forEach((x) => x.unsubscribe());
                touchStart.unsubscribe();
                touchMove.unsubscribe();
                touchEnd.unsubscribe();
                touchPress.unsubscribe();
                longTouch.unsubscribe();
            },
        };
    };
};
exports.default = DefaultTouchProcessor;
