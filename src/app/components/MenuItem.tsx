'use client'

import { Card, CardContent, CardFooter } from '@/app/components/ui/card'
import { MenuItemType } from '@/app/types'
import { cn } from '@/lib/utils'
import React from 'react'

type MenuItemProps = Partial<MenuItemType> & {
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  price,
  // description, (delete temporary description)
  // image,
  orientation = 'vertical',
  className,
}) => {
  // const [imageError, setImageError] = useState(false)
  const isVertical = orientation === 'vertical'

  return (
    <Card
      className={cn(
        `w-full max-w-sm border-0 shadow-none flex ${
          isVertical ? 'flex-col' : 'flex-row items-center'
        } justify-between`,
        className
      )}
    >
      {/* TEMPORARY DELETE IMAGE */}

      {/* <CardHeader className={`p-0 ${isVertical ? 'w-full h-48' : 'w-24 h-24'}`}>
				<div className='relative w-full h-full '>
					{image && !imageError ? (
						<Image
							src={image}
							alt={name ?? 'Menu item image'}
							width={orientation === 'horizontal' ? 96 : 192}
							height={orientation === 'horizontal' ? 96 : 192}
							className='rounded-md justify-self-center object-cover'
							onError={() => setImageError(true)}
						/>
					) : (
						<div className={`${orientation === 'vertical' ? 'w-48 h-48' : 'w-full h-full'} bg-gray-200 rounded-md flex items-center justify-center justify-self-center italic text-text-foreground text-center`}>
							<GiMeal size={32} className="text-gray-600" />
						</div>
					)}
				</div>
			</CardHeader> */}

      <CardContent className={`p-2 border-0 flex-1 text-center`}>
        <h4
          className={`uppercase text-secondary py-2 font-bold ${
            isVertical ? 'text-lg' : 'text-base'
          }`}
        >
          {name}
        </h4>

        {/* TEMPORARY DELETE DESCRIPTION  */}

        {/* <span
          className={`text-sm text-text-foreground italic ${
            isVertical ? 'text-sm' : 'text-xs'
          }`}
        >
          {description}
        </span> */}
      </CardContent>
      <CardFooter
        className={`px-2 pb-2 mt-auto self-center ${
          !isVertical && 'my-auto pb-0'
        }`}
      >
        <span className="text-secondary">{price} zł</span>
      </CardFooter>
    </Card>
  )
}

export default MenuItem
