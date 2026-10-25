import { useEffect, useRef, useState } from 'react'
import { getAvailableTimeSlots } from '../services/timeSlotService'
import { getDateKey } from '../utils/dateTime'

export default function useAvailableTimeSlots({
                                                  refreshVersion = 0,
                                                  onBookingChanged,
                                              }) {
    const hasInitialized = useRef(false)

    const [timeSlots, setTimeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [bookingError, setBookingError] = useState('')

    const [month, setMonth] = useState(() =>
        getDateKey(new Date()).slice(0, 7)
    )

    useEffect(() => {
        const controller = new AbortController()

        async function loadTimeSlots() {
            setIsLoading(true)
            setError('')

            try {
                const data = await getAvailableTimeSlots(controller.signal)

                if (controller.signal.aborted) return

                const sortedSlots = [...data].sort(
                    (first, second) =>
                        new Date(first.startAt) - new Date(second.startAt)
                )

                setTimeSlots(sortedSlots)

                setSelectedSlot((current) =>
                    current
                        ? sortedSlots.find((slot) => slot.id === current.id) ?? null
                        : null
                )

                if (!hasInitialized.current && sortedSlots.length > 0) {
                    const firstDate = getDateKey(sortedSlots[0].startAt)

                    setSelectedDate(firstDate)
                    setMonth(firstDate.slice(0, 7))
                }

                hasInitialized.current = true
            } catch {
                if (!controller.signal.aborted) {
                    setError(
                        'Unable to load available sessions. Please try again.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadTimeSlots()

        return () => controller.abort()
    }, [refreshVersion])

    const availableDates = new Set(
        timeSlots.map((slot) => getDateKey(slot.startAt))
    )

    const dailySlots = timeSlots.filter(
        (slot) => getDateKey(slot.startAt) === selectedDate
    )

    function clearMessages() {
        setSuccessMessage('')
        setBookingError('')
    }

    function selectDate(date) {
        setSelectedDate(date)
        setSelectedSlot(null)
        clearMessages()
    }

    function changeMonth(nextMonth) {
        setMonth(nextMonth)
        setSelectedDate('')
        setSelectedSlot(null)
        clearMessages()
    }

    function selectSlot(slot) {
        setSelectedSlot(slot)
        clearMessages()
    }

    function removeSlot(timeSlotId) {
        setTimeSlots((currentSlots) =>
            currentSlots.filter((slot) => slot.id !== timeSlotId)
        )

        setSelectedSlot(null)
    }

    function handleBookingSuccess(timeSlotId) {
        removeSlot(timeSlotId)
        setBookingError('')
        setSuccessMessage(
            'Your karate session has been booked successfully.'
        )

        onBookingChanged()
    }

    function handleSlotUnavailable(timeSlotId, message) {
        removeSlot(timeSlotId)
        setSuccessMessage('')
        setBookingError(message)

        onBookingChanged()
    }

    function dismissSuccessMessage() {
        setSuccessMessage('')
    }

    return {
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
    }
}