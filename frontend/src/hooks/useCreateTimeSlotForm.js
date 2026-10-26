import { useState } from 'react'
import { createTimeSlot } from '../services/timeSlotService'

export default function useCreateTimeSlotForm({ onTimeSlotCreated }) {
    const [date, setDate] = useState('')
    const [hour, setHour] = useState('')
    const [minute, setMinute] = useState('00')
    const [duration, setDuration] = useState('30')
    const [customDuration, setCustomDuration] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const durationMinutes = Number(
        duration === 'custom' ? customDuration : duration
    )

    async function handleSubmit(event) {
        event.preventDefault()

        if (isSubmitting) return

        if (!date || !hour || !minute) {
            setError('Please select a date and start time.')
            return
        }

        if (
            !Number.isInteger(durationMinutes) ||
            durationMinutes < 1
        ) {
            setError('Please enter a valid duration in whole minutes.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            await createTimeSlot({
                startAt: `${date}T${hour}:${minute}:00`,
                durationMinutes,
            })
        } catch (error) {
            setError(
                error.status
                    ? error.message
                    : 'Unable to connect to the server. Please try again.'
            )
            setIsSubmitting(false)
            return
        }

        setDate('')
        setHour('')
        setMinute('00')
        setIsSubmitting(false)
        onTimeSlotCreated()
    }

    return {
        date,
        hour,
        minute,
        duration,
        customDuration,
        isSubmitting,
        error,
        setDate,
        setHour,
        setMinute,
        setDuration,
        setCustomDuration,
        handleSubmit,
    }
}