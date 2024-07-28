const PageDescription = ({ content }: { content: string }) => {
	return (
		<span className='flex mx-auto text-sm text-justify text-text-foreground'>
			{content}
		</span>
	)
}

export default PageDescription
