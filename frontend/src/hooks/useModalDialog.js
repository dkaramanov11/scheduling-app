import { useEffect, useRef } from 'react'

export default function useModalDialog() {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        const previousFocus = document.activeElement
        const previousOverflow = document.body.style.overflow

        dialog.showModal()
        document.body.style.overflow = 'hidden'

        return () => {
            dialog.close()
            document.body.style.overflow = previousOverflow
            previousFocus?.focus()
        }
    }, [])

    return dialogRef
}