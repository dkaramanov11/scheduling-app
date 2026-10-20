import BookingCalendar from '../BookingCalendar'
import CreateTimeSlotModal from './CreateTimeSlotModal'
import ManagementTimeSlots from './ManagementTimeSlots'
import TimeSlotDetails from './TimeSlotDetails'
import useManageAvailability from '../../hooks/useManageAvailability'
import '../../styles/ManageAvailability.css'
import { useState } from 'react'

function ManageAvailability({
                                onAvailabilityChanged,
                                refreshVersion = 0,
                            }) {
    const [actionMessage, setActionMessage] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const {
        isLoading,
        error,
        month,
        selectedDate,
        selectedSlot,
        scheduledDates,
        dailySlots,
        selectDate,
        changeMonth,
        selectSlot,
        refreshSchedule,
        statusFilter,
        changeStatusFilter,
    } = useManageAvailability(refreshVersion)

    function handleTimeSlotCreated() {
        setIsCreateModalOpen(false)
        setActionMessage('Time slot created successfully.')
        refreshSchedule()
        onAvailabilityChanged()
    }

    function handleScheduleChanged(message) {
        setActionMessage(message)
        refreshSchedule()
        onAvailabilityChanged()
    }

    return (
        <section
            className="management-section"
            id="manage"
            aria-labelledby="management-title"
        >
            <div className="management-heading">
                <div>
                    <p className="management-eyebrow">Coach workspace</p>
                    <h2 id="management-title">Manage availability</h2>
                    <p>Review your schedule and select a training session.</p>
                </div>

                <div className="management-heading-actions">
                    <button
                        className="primary-button"
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add time slot
                    </button>
                </div>
            </div>

            {actionMessage && (
                <p className="management-feedback management-success" role="status">
                    {actionMessage}
                </p>
            )}

            {isLoading && (
                <p className="management-feedback" role="status">
                    Loading the training schedule...
                </p>
            )}

            {error && (
                <p className="management-feedback management-error" role="alert">
                    {error}
                </p>
            )}

            {!isLoading && !error && (
                <div className="management-panel">
                    <BookingCalendar
                        month={month}
                        selectedDate={selectedDate}
                        availableDates={scheduledDates}
                        onMonthChange={changeMonth}
                        onDateSelect={selectDate}
                        hint="Select a date to view scheduled time slots."
                    />

                    <ManagementTimeSlots
                        selectedDate={selectedDate}
                        timeSlots={dailySlots}
                        selectedSlot={selectedSlot}
                        onSlotSelect={selectSlot}
                        statusFilter={statusFilter}
                        onStatusFilterChange={changeStatusFilter}
                    />

                    <TimeSlotDetails
                        slot={selectedSlot}
                        onScheduleChanged={handleScheduleChanged}
                    />
                </div>
            )}

            {isCreateModalOpen && (
                <CreateTimeSlotModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onTimeSlotCreated={handleTimeSlotCreated}
                />
            )}
        </section>
    )
}

export default ManageAvailability