// CookieBanner.tsx
'use client'

import { Button } from '@/app/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog'
import React, { useState } from 'react'
import CookieConsent, { Cookies } from 'react-cookie-consent'

const CookieBanner: React.FC = () => {
	const [showDialog, setShowDialog] = useState(false)

	const handleAccept = () => {
		console.log("Cookies accepted")
		Cookies.set("allCookies", "true", { expires: 150 })
	}

	const handleDecline = () => {
		setShowDialog(true) // Показуємо діалогове вікно
	}

	const confirmCloseSite = () => {
		Cookies.remove("allCookies")
		console.log("Cookies declined")
		setShowDialog(false)
		window.close() // Закриває вкладку браузера
	}

	return (
		<>
			<CookieConsent
				location="bottom"
				buttonText="Przyjmuję wszystkie"
				declineButtonText="Odrzuć"
				enableDeclineButton
				onAccept={handleAccept}
				onDecline={handleDecline}
				style={{ background: "#2B373B" }}
				buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
				declineButtonStyle={{ color: "#cfcfcf", fontSize: "13px" }}
				expires={150}
			>
				Korzystamy z plików cookies, aby ulepszyć działanie naszej strony. Przeczytaj naszą{" "}
				<a href="/privacy-policy" style={{ color: "#ffd700" }}>politykę prywatności</a>, aby dowiedzieć się więcej.
			</CookieConsent>

			{/* Діалог для попередження про закриття сайту */}
			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Odrzucenie cookies</DialogTitle>
						<DialogDescription>
							Jeśli odrzucisz wszystkie cookies, nie będziesz mógł dalej korzystać z naszej strony. Czy na pewno chcesz odrzucić cookies i zamknąć stronę?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setShowDialog(false)} variant="outline">
							Anuluj
						</Button>
						<Button onClick={confirmCloseSite} variant="destructive">
							Odrzuć i zamknij stronę
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default CookieBanner
