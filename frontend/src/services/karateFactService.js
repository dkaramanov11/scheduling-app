import { throwIfError } from './apiErrors'

export async function generateKarateFact() {
    const response = await fetch('/api/ai/karate-fact', {
        method: 'POST',
    })

    await throwIfError(
        response,
        'Unable to generate a karate fact. Please try again.'
    )

    const data = await response.json()

    if (typeof data.fact !== 'string' || !data.fact.trim()) {
        throw new Error(
            'The AI service returned an empty fact. Please try again.'
        )
    }

    return data.fact.trim()
}