const PageHeader = ({ title }: { title: string }) => {
	return (
		<h2 className='text-6xl text-center font-semibold text-text-secondary py-2 px-2 self-center mx-2'>
			{title}
		</h2>
	)
}

export default PageHeader