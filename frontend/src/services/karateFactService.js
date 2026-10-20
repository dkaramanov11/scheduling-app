export async function generateKarateFact() {
    const response = await fetch('/api/ai/karate-fact', {
        method: 'POST',
    })

    if (!response.ok) {
        const problem = await response.json().catch(() => null)

        const error = new Error(
            problem?.detail ||
            'Unable to generate a karate fact. Please try again.'
        )

        error.status = response.status
        throw error
    }

    const data = await response.json()

    if (typeof data.fact !== 'string' || !data.fact.trim()) {
        throw new Error('The AI service returned an empty fact. Please try again.')
    }

    return data.fact.trim()
}