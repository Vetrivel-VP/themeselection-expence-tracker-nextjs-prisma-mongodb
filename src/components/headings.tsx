'use client'

interface HeadingProps {
  title: string
  description?: string
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
