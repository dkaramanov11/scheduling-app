import AvailableTimeSlots from './components/AvailableTimeSlots'
import CreateTimeSlotForm from './components/CreateTimeSlotForm'
import { useState } from 'react'
import './styles/App.css'

function App() {
    const [availabilityVersion, setAvailabilityVersion] = useState(0)

    function handleTimeSlotCreated() {
        setAvailabilityVersion((current) => current + 1)
    }
    return (
        <main className="app">
            <h1>Scheduling App</h1>
            <p>Find a time that works for you and book a meeting.</p>

            <AvailableTimeSlots key={availabilityVersion} />

            <CreateTimeSlotForm onTimeSlotCreated={handleTimeSlotCreated} />
        </main>
    )
}

export default App