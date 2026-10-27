import { throwIfError } from './apiErrors'

export async function getAvailableTimeSlots(signal) {
    const response = await fetch('/api/time-slots', { signal })

    // Оваа функција ја задржува постојната порака за грешка.
    if (!response.ok) {
        throw new Error(
            'Unable to load available time slots. Please try again.'
        )
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

    await throwIfError(
        response,
        'Unable to create the time slot. Please try again.'
    )

    return response.json()
}

export async function getManageTimeSlots(signal) {
    const response = await fetch('/api/time-slots/manage', { signal })

    await throwIfError(
        response,
        'Unable to load the training schedule. Please try again.'
    )

    return response.json()
}

export async function cancelTimeSlot(timeSlotId) {
    const response = await fetch(`/api/time-slots/${timeSlotId}/cancel`, {
        method: 'PATCH',
    })

    await throwIfError(
        response,
        'Unable to remove the time slot. Please try again.'
    )
}