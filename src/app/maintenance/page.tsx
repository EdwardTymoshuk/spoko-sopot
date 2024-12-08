// src/maintenance/page.tsx

const Maintenance = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-screen p-8 mx-auto space-y-4 text-center">
			<img src='/img/logo-spoko-2.png' className='w-3/4 md:w-2/5 lg:w-1/4 h-auto' />
			<h1 className="text-4xl md:text-6xl font-bold mb-6 text-secondary">Pracujemy nad czymś wyjątkowym!</h1>
			<p className="text-lg md:text-2xl text-text-foreground">
				Strona jest obecnie w trakcie rozwoju. Zapraszamy wkrótce, aby zobaczyć efekty naszej pracy. Dziękujemy za wyrozumiałość!
			</p>
		</div>
	)
}

export default Maintenance
