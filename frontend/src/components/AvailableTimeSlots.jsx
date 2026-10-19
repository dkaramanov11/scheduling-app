import { useEffect, useState } from 'react'
import { getAvailableTimeSlots } from '../services/timeSlotService'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Skopje',
    dateStyle: 'full',
    timeStyle: 'short',
})

function AvailableTimeSlots() {
    const [timeSlots, setTimeSlots] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const controller = new AbortController()

        async function loadTimeSlots() {
            try {
                const data = await getAvailableTimeSlots(controller.signal)

                if (!controller.signal.aborted) {
                    setTimeSlots(data)
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError('Unable to load available time slots. Please try again.')
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadTimeSlots()

        return () => controller.abort()
    }, [])

    return (
        <section className="availability" aria-labelledby="availability-title">
            <h2 id="availability-title">Available time slots</h2>
            <p>All times are shown in Europe/Skopje.</p>

            {isLoading && (
                <p role="status">Loading available time slots...</p>
            )}

            {!isLoading && error && (
                <p role="alert">{error}</p>
            )}

            {!isLoading && !error && timeSlots.length === 0 && (
                <p role="status">
                    No available time slots right now. Please check back later.
                </p>
            )}

            {!isLoading && !error && timeSlots.length > 0 && (
                <ul>
                    {timeSlots.map((slot) => (
                        <li key={slot.id}>
                            {dateFormatter.format(new Date(slot.startAt))}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default AvailableTimeSlots