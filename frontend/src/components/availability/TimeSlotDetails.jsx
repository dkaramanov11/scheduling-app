import { formatDate, formatTimeRange } from '../../utils/dateTime'
import TimeSlotActions from './TimeSlotActions'

const statusLabels = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    CANCELLED: 'Cancelled',
}

function TimeSlotDetails({ slot, onScheduleChanged }) {
    return (
        <div className="management-details">
            <h3>Training details</h3>

            {!slot ? (
                <p>
                    Select a time slot to see its details.
                </p>
            ) : (
                <>
                    <span
                        className={`slot-status status-${slot.status.toLowerCase()}`}
                    >
                        {statusLabels[slot.status] ?? slot.status}
                    </span>

                    <dl className="management-detail-list">
                        <div>
                            <dt>Date</dt>
                            <dd>{formatDate(slot.startAt)}</dd>
                        </div>

                        <div>
                            <dt>Time</dt>
                            <dd>
                                {formatTimeRange(slot.startAt, slot.endAt)}
                            </dd>
                        </div>

                        <div>
                            <dt>Duration</dt>
                            <dd>{slot.durationMinutes} minutes</dd>
                        </div>

                        {slot.cancelledAt && (
                            <div>
                                <dt>Cancelled on</dt>
                                <dd>{formatDate(slot.cancelledAt)}</dd>
                            </div>
                        )}
                    </dl>

                    {slot.status === 'BOOKED' && (
                        <p className="management-detail-note">
                            This time slot has a reservation.
                        </p>
                    )}

                    {slot.status === 'AVAILABLE' && (
                        <p className="management-detail-note">
                            This time slot is available for booking.
                        </p>
                    )}

                    {slot.status === 'CANCELLED' && (
                        <p className="management-detail-note">
                            This time slot has been removed from the schedule.
                        </p>
                    )}

                    <TimeSlotActions
                        key={`${slot.id}-${slot.status}-${slot.bookingId ?? ''}`}
                        slot={slot}
                        onScheduleChanged={onScheduleChanged}
                    />
                </>
            )}
        </div>
    )
}

export default TimeSlotDetails