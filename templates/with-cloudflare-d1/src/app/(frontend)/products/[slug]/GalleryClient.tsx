'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

export function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0)
  const current = images[active]

  if (!current) return null

  return (
    <div style={{ paddingBottom: 32 }}>
      <div className="gallery-main">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          sizes="480px"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`gallery-thumb${i === active ? ' active' : ''}`}
              onClick={() => setActive(i)}
              style={{ border: 'none', padding: 0, cursor: 'pointer' }}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={72}
                height={54}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
