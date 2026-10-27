export async function throwIfError(response, fallbackMessage) {
    if (response.ok) return

    const problem = await response.json().catch(() => null)

    const error = new Error(problem?.detail || fallbackMessage)
    error.status = response.status
    error.errors = problem?.errors

    throw error
}