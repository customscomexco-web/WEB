'use client'

interface RichTextSectionProps {
  content: {
    html?: string
    richText?: any
  }
}

export function RichTextSection({ content }: RichTextSectionProps) {
  // For now, render simple HTML. In production, you'd parse TipTap JSON
  if (content.html) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        </div>
      </section>
    )
  }

  return null
}

