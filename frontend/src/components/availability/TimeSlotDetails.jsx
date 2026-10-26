import { formatDate, formatTimeRange } from '../../utils/dateTime'
import TimeSlotActions from './TimeSlotActions'
import '../../styles/availability/TimeSlotDetails.css'
import '../../styles/availability/SlotStatus.css'
import {
    TIME_SLOT_STATUS_LABELS,
    TRAINING_FOCUS_LABELS,
    EXPERIENCE_LEVEL_LABELS,
} from '../../constants/training'

function TimeSlotDetails({ slot, onScheduleChanged }) {
    const isBooked = slot?.status === 'BOOKED'
    const booking = isBooked ? slot.booking : null
    const hasCalendarConflict = slot?.googleCalendarConflict === true

    return (
        <div className="management-details">
            <h3>{isBooked ? 'Booking details' : 'Training details'}</h3>

            {!slot ? (
                <p>Select a time slot to see its details.</p>
            ) : (
                <>
                    <span
                        className={`slot-status status-${slot.status.toLowerCase()}`}
                    >
                        {TIME_SLOT_STATUS_LABELS[slot.status] ?? slot.status}
                    </span>

                    {hasCalendarConflict && (
                        <p className="management-calendar-notice">
                            Busy in Google Calendar. This time slot overlaps with
                            an event in the coach’s calendar.
                        </p>
                    )}

                    {isBooked && (
                        booking ? (
                            <dl className="management-detail-list management-booking-info">
                                <div>
                                    <dt>Full name</dt>
                                    <dd>{booking.customerName}</dd>
                                </div>

                                <div>
                                    <dt>Email address</dt>
                                    <dd>{booking.customerEmail}</dd>
                                </div>

                                <div>
                                    <dt>Training focus</dt>
                                    <dd>
                                        {TRAINING_FOCUS_LABELS[booking.trainingFocus]
                                            ?? booking.trainingFocus
                                            ?? 'Not specified'}
                                    </dd>
                                </div>

                                <div>
                                    <dt>Experience level</dt>
                                    <dd>
                                        {EXPERIENCE_LEVEL_LABELS[booking.experienceLevel]
                                            ?? booking.experienceLevel
                                            ?? 'Not specified'}
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="management-detail-note" role="status">
                                Booking details are currently unavailable.
                            </p>
                        )
                    )}

                    {!isBooked && (
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
                    )}

                    {slot.status === 'CANCELLED' && (
                        <p className="management-detail-note">
                            This time slot has been removed from the schedule.
                        </p>
                    )}

                    <div
                        className={
                            slot.status === 'AVAILABLE'
                                ? 'management-actions-alignment management-actions-separated'
                                : 'management-actions-alignment'
                        }
                    >
                        <TimeSlotActions
                            key={`${slot.id}-${slot.status}-${slot.bookingId ?? ''}`}
                            slot={slot}
                            onScheduleChanged={onScheduleChanged}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default TimeSlotDetails