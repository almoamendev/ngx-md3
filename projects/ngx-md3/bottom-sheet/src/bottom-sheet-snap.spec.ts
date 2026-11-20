import { nearestPointIndex, settleTarget } from './bottom-sheet-snap';

describe('settleTarget', () => {
    // A modal sheet: one resting height and a dismiss point a full surface height below it.
    const modal = [0, 400];
    // A standard sheet 400px tall peeking 100px, so collapsed sits 300px down.
    const standard = [0, 300];
    const dismissible = [0, 300, 400];

    function settle(points: number[], origin: number, offset: number, velocity = 0, idleTime = 0): number {
        return settleTarget({ points, origin, offset, velocity, idleTime });
    }

    describe('modal sheets', () => {
        it('dismisses once the drag passes the distance threshold', () => {
            expect(settle(modal, 0, 161)).toBe(1);
        });

        it('snaps back when the drag stops short of it', () => {
            expect(settle(modal, 0, 159)).toBe(0);
        });

        it('dismisses on a downward fling whatever distance it covered', () => {
            expect(settle(modal, 0, 20, 0.9, 16)).toBe(1);
        });

        it('ignores the speed when the finger stopped before letting go', () => {
            expect(settle(modal, 0, 20, 0.9, 200)).toBe(0);
        });

        it('stays put on an upward fling, having nowhere higher to go', () => {
            expect(settle(modal, 0, 0, -0.9, 16)).toBe(0);
        });
    });

    describe('standard sheets', () => {
        it('collapses when a drag down from expanded passes the threshold', () => {
            expect(settle(standard, 0, 121)).toBe(1);
        });

        it('returns to expanded when it does not', () => {
            expect(settle(standard, 0, 119)).toBe(0);
        });

        it('expands when a drag up from collapsed passes the threshold', () => {
            expect(settle(standard, 300, 179)).toBe(0);
        });

        it('returns to collapsed when it does not', () => {
            expect(settle(standard, 300, 181)).toBe(1);
        });

        it('moves one point at a time, so a long drag from expanded only collapses', () => {
            expect(settle(dismissible, 0, 400)).toBe(1);
        });

        it('dismisses only from collapsed, and only when there is a point to dismiss to', () => {
            expect(settle(dismissible, 300, 361)).toBe(2);
            expect(settle(standard, 300, 361)).toBe(1);
        });

        it('takes the next point in the direction of a fling', () => {
            expect(settle(dismissible, 300, 310, 0.9, 16)).toBe(2);
            expect(settle(dismissible, 300, 290, -0.9, 16)).toBe(0);
        });

        it('stays where it is when the drag ended where it started', () => {
            expect(settle(standard, 300, 300)).toBe(1);
        });
    });

    it('copes with a sheet that has not been measured yet', () => {
        expect(settle([], 0, 50)).toBe(0);
        expect(settle([0], 0, 50)).toBe(0);
    });
});

describe('nearestPointIndex', () => {
    it('finds the point an offset sits closest to', () => {
        expect(nearestPointIndex([0, 300, 400], 0)).toBe(0);
        expect(nearestPointIndex([0, 300, 400], 280)).toBe(1);
        expect(nearestPointIndex([0, 300, 400], 390)).toBe(2);
    });

    it('resolves ties towards the lower index', () => {
        expect(nearestPointIndex([0, 100], 50)).toBe(0);
    });
});
