import { useEffect, useRef, useState } from 'react'
import { generateKarateFact } from '../services/karateFactService'

const storageKey = 'dojo-karate-fact'

let pendingRequest = null

function readSavedFact() {
    try {
        return sessionStorage.getItem(storageKey)?.trim() || ''
    } catch {
        return ''
    }
}

function requestFact() {
    if (!pendingRequest) {
        pendingRequest = generateKarateFact()
            .then((fact) => {
                try {
                    sessionStorage.setItem(storageKey, fact)
                } catch {
                    // The fact can still be displayed without browser storage.
                }

                return fact
            })
            .finally(() => {
                pendingRequest = null
            })
    }

    return pendingRequest
}

export default function useKarateFact() {
    const [fact, setFact] = useState(readSavedFact)
    const [isLoading, setIsLoading] = useState(() => !readSavedFact())
    const [error, setError] = useState('')
    const isGenerating = useRef(false)

    useEffect(() => {
        let isActive = true
        const savedFact = readSavedFact()

        if (savedFact) return

        requestFact()
            .then((nextFact) => {
                if (isActive) {
                    setFact(nextFact)
                    setError('')
                }
            })
            .catch((error) => {
                if (isActive) {
                    setError(error.message || 'Unable to generate a karate fact.')
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false)
                }
            })

        return () => {
            isActive = false
        }
    }, [])

    async function generateAnotherFact() {
        if (isLoading || isGenerating.current) return

        isGenerating.current = true
        setIsLoading(true)
        setError('')

        try {
            const nextFact = await requestFact()
            setFact(nextFact)
        } catch (error) {
            setError(error.message || 'Unable to generate a karate fact.')
        } finally {
            isGenerating.current = false
            setIsLoading(false)
        }
    }

    return {
        fact,
        isLoading,
        error,
        generateAnotherFact,
    }
}