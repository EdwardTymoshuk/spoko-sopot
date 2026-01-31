interface PageHeaderContainerProps {
  title: string
  description: string
  image: string
  imageMobile?: string
}

/**
 * PageHeaderContainer
 * --------------------------------------------------
 * Full-width hero section with background image,
 * dark overlay and centered text content.
 *
 * - Responsive background (desktop / mobile)
 * - Dark overlay for better text readability
 * - Used as page introduction / hero section
 */
const PageHeaderContainer = ({
  title,
  description,
  image,
  imageMobile,
}: PageHeaderContainerProps) => {
  return (
    <section className="relative w-full h-[30vh] min-h-96 mb-8 z-0">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      {/* Mobile background override */}
      {imageMobile && (
        <div
          className="absolute inset-0 bg-cover bg-center md:hidden"
          style={{
            backgroundImage: `url(${imageMobile})`,
          }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-primary">
            {title}
          </h1>

          <p className="text-base italic md:text-lg lg:text-xl opacity-90">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

export default PageHeaderContainer
