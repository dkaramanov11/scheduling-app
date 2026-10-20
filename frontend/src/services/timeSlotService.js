export async function getAvailableTimeSlots(signal) {

    const response = await fetch('/api/time-slots', { signal })

    if (!response.ok) {
        throw new Error('Unable to load available time slots. Please try again.')
    }

    return response.json()

}

export async function createTimeSlot(timeSlot) {
    const response = await fetch('/api/time-slots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(timeSlot),
    })

    if (!response.ok) {
        const problem = await response.json().catch(() => null)

        const error = new Error(
            problem?.detail || 'Unable to create the time slot. Please try again.'
        )

        error.status = response.status
        error.errors = problem?.errors

        throw error
    }

    return response.json()
}

export async function getManageTimeSlots(signal) {
    const response = await fetch('/api/time-slots/manage', { signal })

    if (!response.ok) {
        const problem = await response.json().catch(() => null)

        const error = new Error(
            problem?.detail ||
            'Unable to load the training schedule. Please try again.'
        )

        error.status = response.status

        throw error
    }

    return response.json()
}