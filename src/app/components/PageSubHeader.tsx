const PageSubHeader = ({ title }: { title: string }) => {
	return (
		<h3 className='text-4xl text-center font-semibold text-text-secondary py-2 px-2 self-center mx-2'>
			{title}
		</h3>
	)
}

export default PageSubHeader