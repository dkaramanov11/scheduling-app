export async function getAvailableTimeSlots(signal) {

    const response = await fetch('/api/time-slots', { signal })

    if (!response.ok) {
        throw new Error('Unable to load available time slots. Please try again.')
    }

    return response.json()

}