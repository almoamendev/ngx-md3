/** Movement shorter than this is still a tap rather than a drag. */
export const DRAG_START_THRESHOLD_PX = 4;

/** Part of the segment being crossed that a drag has to cover to commit to the next snap point. */
export const SETTLE_DISTANCE_RATIO = 0.4;

/** Speed, in pixels per millisecond, that carries the sheet to the next snap point on its own. */
export const FLING_VELOCITY = 0.5;

/** A release this long after the last move is a stop, so the speed before it no longer counts. */
export const VELOCITY_TIMEOUT_MS = 100;

export interface SnapSettleInput {
    /**
     * Snap offsets in pixels below the fully expanded position, ascending: expanded first,
     * then collapsed, then dismissed when dragging that far is allowed.
     */
    points: number[];

    /** Offset the drag started from. */
    origin: number;

    /** Offset the drag ended at. */
    offset: number;

    /** Signed speed of the last move in pixels per millisecond, positive downwards. */
    velocity: number;

    /** Time between the last move and the release, so a finger that stopped is not a fling. */
    idleTime: number;
}

/**
 * Picks the snap point a released drag settles on, as an index into `points`.
 *
 * A drag only ever moves one point at a time: it commits to the neighbour in the direction of
 * travel once it has covered enough of the gap, or immediately when it was thrown hard enough,
 * and otherwise falls back to where it started. A modal sheet is the two-point case of this —
 * resting and dismissed — which is why generalizing the gesture leaves it behaving the same.
 */
export function settleTarget(input: SnapSettleInput): number {
    const { points, origin, offset, velocity, idleTime } = input;

    if (points.length === 0) {
        return 0;
    }

    const originIndex = nearestPointIndex(points, origin);

    if (idleTime < VELOCITY_TIMEOUT_MS && Math.abs(velocity) > FLING_VELOCITY) {
        return clampIndex(originIndex + (velocity > 0 ? 1 : -1), points.length);
    }

    const direction = Math.sign(offset - points[originIndex]);

    if (direction === 0) {
        return originIndex;
    }

    const targetIndex = clampIndex(originIndex + direction, points.length);
    const segment = Math.abs(points[targetIndex] - points[originIndex]);
    const travelled = Math.abs(offset - points[originIndex]);

    return segment > 0 && travelled >= segment * SETTLE_DISTANCE_RATIO ? targetIndex : originIndex;
}

/** Snap point the given offset sits closest to. Ties go to the lower index. */
export function nearestPointIndex(points: number[], offset: number): number {
    let nearest = 0;

    for (let index = 1; index < points.length; index++) {
        if (Math.abs(points[index] - offset) < Math.abs(points[nearest] - offset)) {
            nearest = index;
        }
    }

    return nearest;
}

function clampIndex(index: number, length: number): number {
    return Math.min(Math.max(index, 0), length - 1);
}
