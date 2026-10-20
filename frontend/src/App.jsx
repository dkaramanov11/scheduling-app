import { useState } from 'react'
import Header from './components/Header'
import AvailableTimeSlots from './components/AvailableTimeSlots'
import Hero from './components/Hero'
import CoachSection from './components/CoachSection'
import ManageAvailability from './components/availability/ManageAvailability'
import './styles/App.css'

function App() {

    const [availabilityVersion, setAvailabilityVersion] = useState(0)

    function handleAvailabilityChanged() {
        setAvailabilityVersion((current) => current + 1)
    }

    return (
        <div className="app" id="home">
            <Header />

            <main>
                <Hero />

                <div id="booking">
                    <AvailableTimeSlots key={availabilityVersion} />
                </div>

                <CoachSection />

                <ManageAvailability
                    onAvailabilityChanged={handleAvailabilityChanged}
                />
            </main>
        </div>
    )
}

export default App