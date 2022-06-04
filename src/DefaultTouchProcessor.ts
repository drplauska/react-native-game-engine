import { NativeTouchEvent, GestureResponderEvent } from "react-native";
import { Subject, of, merge, EMPTY } from "rxjs";
import { AnonymousSubject } from "rxjs/internal/Subject";
import {
  mergeMap,
  first,
  timeoutWith,
  delay,
  takeUntil,
  map,
  groupBy,
  filter,
  pairwise,
} from "rxjs/operators";
import { TouchEventType } from "types";

interface DefaultTouchProcessorProps {
  triggerPressEventBefore?: number;
  triggerLongPressEventAfter?: number;
  moveThreshold?: number;
}

const DefaultTouchProcessor = ({
  triggerPressEventBefore = 200,
  triggerLongPressEventAfter = 700,
  moveThreshold = 0,
}: DefaultTouchProcessorProps) => {
  return (touches: NativeTouchEvent[]) => {
    const touchStart = new Subject<NativeTouchEvent>().pipe(
      map((e) => ({ id: e.identifier, type: "start", event: e }))
    ) as AnonymousSubject<NativeTouchEvent>;
    const touchMove = new Subject<NativeTouchEvent>().pipe(
      map((e) => ({ id: e.identifier, type: "move", event: e }))
    );
    const touchEnd = new Subject<NativeTouchEvent>().pipe(
      map((e) => ({ id: e.identifier, type: "end", event: e }))
    );

    const touchPress = touchStart.pipe(
      mergeMap((e) =>
        touchEnd.pipe(
          first((x) => x.id === e.id),
          timeoutWith(triggerPressEventBefore, EMPTY)
        )
      ),
      map((e) => ({ ...e, type: "press" }))
    );

    const touchMoveDelta = merge(touchStart, touchMove, touchEnd).pipe(
      groupBy((e) => e.id),
      mergeMap((group) =>
        group.pipe(
          pairwise(),
          map(([e1, e2]) => {
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
          }),
          filter((e) => {
            if (!e) {
              return false;
            }
            return e.delta.pageX ** 2 + e.delta.pageY ** 2 > moveThreshold ** 2;
          })
        )
      )
    );

    const longTouch = touchStart.pipe(
      mergeMap((e) =>
        of(e).pipe(
          delay(triggerLongPressEventAfter),
          takeUntil(
            merge(touchMoveDelta, touchEnd).pipe(first((x) => x?.id === e.id))
          )
        )
      ),
      map((e) => ({ ...e, type: "long-press" }))
    );

    const subscriptions = [
      touchStart,
      touchEnd,
      touchPress,
      longTouch,
      touchMoveDelta,
    ].map((x) => x.subscribe((y) => touches.push(y)));

    return {
      process(
        type: TouchEventType,
        event: GestureResponderEvent["nativeEvent"]
      ) {
        switch (type) {
          case "start":
            console.log(touchStart.next);
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

export default DefaultTouchProcessor;
