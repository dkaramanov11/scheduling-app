import { useState } from 'react'
import Header from './components/Header'
import AvailableTimeSlots from './components/booking/AvailableTimeSlots.jsx'
import Hero from './components/Hero'
import CoachSection from './components/CoachSection'
import ManageAvailability from './components/availability/ManageAvailability'
import './styles/App.css'
import KarateFact from './components/KarateFact'
import './styles/shared/Notifications.css'

function App() {
    const [availabilityVersion, setAvailabilityVersion] = useState(0)
    const [managementVersion, setManagementVersion] = useState(0)

    function handleAvailabilityChanged() {
        setAvailabilityVersion((current) => current + 1)
    }

    function handleBookingChanged() {
        setManagementVersion((current) => current + 1)
    }

    return (
        <div className="app" id="home">
            <Header />

            <main>
                <Hero />

                <div id="booking">
                    <AvailableTimeSlots
                        refreshVersion={availabilityVersion}
                        onBookingChanged={handleBookingChanged}
                    />
                </div>

                <CoachSection />

                <KarateFact />

                <ManageAvailability
                    refreshVersion={managementVersion}
                    onAvailabilityChanged={handleAvailabilityChanged}
                />
            </main>
        </div>
    )
}

export default App