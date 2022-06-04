declare const DefaultTouchProcessor: ({ triggerPressEventBefore, triggerLongPressEventAfter, moveThreshold, }: {
    triggerPressEventBefore?: number | undefined;
    triggerLongPressEventAfter?: number | undefined;
    moveThreshold?: number | undefined;
}) => (touches: any) => {
    process(type: any, event: any): void;
    end(): void;
};
export default DefaultTouchProcessor;
//# sourceMappingURL=DefaultTouchProcessor.d.ts.map