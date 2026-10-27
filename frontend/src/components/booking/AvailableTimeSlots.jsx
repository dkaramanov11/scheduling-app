import BookingCalendar from '../shared/BookingCalendar.jsx'
import BookingForm from './BookingForm.jsx'
import AvailableSessionTimes from './AvailableSessionTimes.jsx'
import SessionSummary from './SessionSummary.jsx'
import useAvailableTimeSlots from '../../hooks/useAvailableTimeSlots.js'
import '../../styles/booking/AvailableTimeSlots.css'

function AvailableTimeSlots({
                                refreshVersion = 0,
                                onBookingChanged,
                            }) {
    const {
        timeSlots,
        isLoading,
        error,
        month,
        selectedDate,
        selectedSlot,
        availableDates,
        dailySlots,
        successMessage,
        bookingError,
        selectDate,
        changeMonth,
        selectSlot,
        handleBookingSuccess,
        handleSlotUnavailable,
        dismissSuccessMessage,
    } = useAvailableTimeSlots({
        refreshVersion,
        onBookingChanged,
    })

    return (
        <section
            className="availability booking-panel"
            aria-labelledby="availability-title"
        >
            <BookingCalendar
                month={month}
                selectedDate={selectedDate}
                availableDates={availableDates}
                onMonthChange={changeMonth}
                onDateSelect={selectDate}
            />

            <AvailableSessionTimes
                isLoading={isLoading}
                error={error}
                hasTimeSlots={timeSlots.length > 0}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                dailySlots={dailySlots}
                successMessage={successMessage}
                bookingError={bookingError}
                onSlotSelect={selectSlot}
                onDismissSuccess={dismissSuccessMessage}
            />

            <SessionSummary selectedSlot={selectedSlot} />

            {selectedSlot && (
                <BookingForm
                    key={selectedSlot.id}
                    timeSlotId={selectedSlot.id}
                    onBookingSuccess={handleBookingSuccess}
                    onSlotUnavailable={handleSlotUnavailable}
                />
            )}
        </section>
    )
}

export default AvailableTimeSlots