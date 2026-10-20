import { useEffect, useState } from 'react'
import { getManageTimeSlots } from '../services/timeSlotService'
import { getDateKey } from '../utils/dateTime'

export default function useManageAvailability() {
    const [timeSlots, setTimeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlotId, setSelectedSlotId] = useState(null)
    const [month, setMonth] = useState(() =>
        getDateKey(new Date()).slice(0, 7)
    )
    const [refreshVersion, setRefreshVersion] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        async function loadSchedule() {
            setIsLoading(true)
            setError('')

            try {
                const data = await getManageTimeSlots(controller.signal)

                if (controller.signal.aborted) return

                const sortedSlots = [...data].sort(
                    (first, second) =>
                        new Date(first.startAt) - new Date(second.startAt)
                )

                setTimeSlots(sortedSlots)

                if (sortedSlots.length > 0) {
                    const firstDate = getDateKey(sortedSlots[0].startAt)

                    setSelectedDate((current) => current || firstDate)
                    setMonth((current) =>
                        refreshVersion === 0
                            ? firstDate.slice(0, 7)
                            : current
                    )
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(
                        error.message ||
                        'Unable to load the training schedule.'
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadSchedule()

        return () => controller.abort()
    }, [refreshVersion])

    const scheduledDates = new Set(
        timeSlots.map((slot) => getDateKey(slot.startAt))
    )

    const dailySlots = timeSlots.filter(
        (slot) => getDateKey(slot.startAt) === selectedDate
    )

    const selectedSlot = dailySlots.find(
        (slot) => slot.id === selectedSlotId
    ) ?? null

    function selectDate(date) {
        setSelectedDate(date)
        setSelectedSlotId(null)
    }

    function changeMonth(nextMonth) {
        setMonth(nextMonth)
        setSelectedDate('')
        setSelectedSlotId(null)
    }

    function refreshSchedule() {
        setRefreshVersion((current) => current + 1)
    }

    return {
        isLoading,
        error,
        month,
        selectedDate,
        selectedSlot,
        scheduledDates,
        dailySlots,
        selectDate,
        changeMonth,
        selectSlot: setSelectedSlotId,
        refreshSchedule,
    }
}