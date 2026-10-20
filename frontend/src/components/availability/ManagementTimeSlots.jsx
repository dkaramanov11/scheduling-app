import { formatDate, formatTimeRange } from '../../utils/dateTime'

const statusLabels = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    CANCELLED: 'Cancelled',
}

function ManagementTimeSlots({
                                 selectedDate,
                                 timeSlots,
                                 selectedSlot,
                                 onSlotSelect,
                             }) {
    return (
        <div className="management-times">
            <h3>
                {selectedDate
                    ? formatDate(`${selectedDate}T12:00:00Z`)
                    : 'Choose a date'}
            </h3>

            {!selectedDate ? (
                <p>Select a day in the calendar to view its schedule.</p>
            ) : timeSlots.length === 0 ? (
                <p>No time slots on this date.</p>
            ) : (
                <ul className="management-slot-list">
                    {timeSlots.map((slot) => (
                        <li key={slot.id}>
                            <button
                                type="button"
                                className={
                                    selectedSlot?.id === slot.id
                                        ? 'management-slot selected'
                                        : 'management-slot'
                                }
                                aria-pressed={selectedSlot?.id === slot.id}
                                onClick={() => onSlotSelect(slot.id)}
                            >
                                <span className="management-slot-time">
                                    {formatTimeRange(slot.startAt, slot.endAt)}
                                </span>

                                <span
                                    className={`slot-status status-${slot.status.toLowerCase()}`}
                                >
                                    {statusLabels[slot.status] ?? slot.status}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default ManagementTimeSlots