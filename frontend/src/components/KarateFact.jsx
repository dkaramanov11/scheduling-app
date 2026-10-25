import useKarateFact from '../hooks/useKarateFact'
import '../styles/ai/KarateFact.css'

function KarateFact() {
    const {
        fact,
        isLoading,
        error,
        generateAnotherFact,
    } = useKarateFact()

    return (
        <section className="karate-fact" aria-labelledby="karate-fact-title">
            <h2 id="karate-fact-title">Did you know?</h2>

            <div className="karate-fact-content">
                <div className="karate-fact-text" aria-live="polite">
                    {fact && <p>{fact}</p>}

                    {isLoading && (
                        <p className="karate-fact-loading">
                            Generating a karate fact…
                        </p>
                    )}
                </div>

                {error && (
                    <p className="karate-fact-error" role="alert">
                        {error}
                    </p>
                )}

                <span className="karate-fact-attribution">
                    AI-generated 
                </span>
            </div>

            <button
                className="karate-fact-button"
                type="button"
                onClick={generateAnotherFact}
                disabled={isLoading}
            >
                {isLoading
                    ? 'Generating…'
                    : error
                        ? 'Try again'
                        : 'Discover another fact'}
            </button>
        </section>
    )
}

export default KarateFact