import { formatDate, formatTimeRange } from '../../../utils/dateTime.js'
import '../../../styles/availability/ManagementTimeSlots.css'
import '../../../styles/availability/SlotStatus.css'
import { TIME_SLOT_STATUS_LABELS } from '../../../constants/training.js'
import { EMPTY_SCHEDULE_MESSAGES } from '../../../constants/managementMessages.js'

function ManagementTimeSlots({
                                 selectedDate,
                                 timeSlots,
                                 selectedSlot,
                                 onSlotSelect,
                                 statusFilter,
                                 onStatusFilterChange,
                                 focusFilter,
                                 onFocusFilterChange,
                             }) {
    return (
        <div className="management-times">
            <h3>
                {selectedDate
                    ? formatDate(`${selectedDate}T12:00:00Z`)
                    : 'Choose a date'}
            </h3>

            <div className="management-filters">
                <div className="management-filter">
                    <label htmlFor="management-status-filter">
                        Status
                    </label>

                    <select
                        id="management-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            onStatusFilterChange(event.target.value)
                        }
                    >
                        <option value="ALL">All statuses</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="BOOKED">Booked</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div className="management-filter">
                    <label htmlFor="management-focus-filter">
                        Focus
                    </label>

                    <select
                        id="management-focus-filter"
                        value={focusFilter}
                        onChange={(event) =>
                            onFocusFilterChange(event.target.value)
                        }
                    >
                        <option value="ALL">All training</option>
                        <option value="KIHON">Kihon</option>
                        <option value="KATA">Kata</option>
                        <option value="KUMITE">Kumite</option>
                    </select>
                </div>
            </div>

            {!selectedDate ? (
                <p>Select a day in the calendar to view its schedule.</p>
            ) : timeSlots.length === 0 ? (
                <p role="status">
                    {focusFilter !== 'ALL'
                        ? 'No sessions match these filters on this date.'
                        : EMPTY_SCHEDULE_MESSAGES[statusFilter]}
                </p>
            ) : (
                <ul className="management-slot-list">
                    {timeSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id
                        const hasConflict = slot.googleCalendarConflict === true

                        const className = [
                            'management-slot',
                            isSelected && 'selected',
                            hasConflict && 'calendar-conflict',
                        ].filter(Boolean).join(' ')

                        return (
                            <li key={slot.id}>
                                <button
                                    type="button"
                                    className={className}
                                    aria-pressed={isSelected}
                                    onClick={() => onSlotSelect(slot.id)}
                                >
                                    <span className="management-slot-time">
                                        {formatTimeRange(slot.startAt, slot.endAt)}
                                    </span>

                                    <span
                                        className={`slot-status status-${slot.status.toLowerCase()}`}
                                    >
                                        {TIME_SLOT_STATUS_LABELS[slot.status] ?? slot.status}
                                    </span>

                                    {hasConflict && (
                                        <span className="management-calendar-conflict">
                                            Busy in Google Calendar
                                        </span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default ManagementTimeSlots