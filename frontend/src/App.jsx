import { useState } from 'react'
import Header from './components/Header'
import AvailableTimeSlots from './components/AvailableTimeSlots'
import CreateTimeSlotForm from './components/CreateTimeSlotForm'
import './styles/App.css'
import Hero from './components/Hero'
import CoachSection from './components/CoachSection'

function App() {
    const [availabilityVersion, setAvailabilityVersion] = useState(0)

    function handleTimeSlotCreated() {
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

                <CreateTimeSlotForm onTimeSlotCreated={handleTimeSlotCreated} />
            </main>
        </div>
    )
}

export default App