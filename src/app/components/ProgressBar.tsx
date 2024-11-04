// components/ProgressBar.tsx
'use client'

import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'

const ProgressBar = () => {
	const pathname = usePathname()

	useEffect(() => {
		NProgress.start()
		NProgress.done()
	}, [pathname])

	return null
}

export default ProgressBar
