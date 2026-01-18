import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  })

  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post || post.status !== 'PUBLISHED') {
    return {}
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      images: post.ogImageUrl ? [post.ogImageUrl] : post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post || post.status !== 'PUBLISHED' || !post.publishedAt) {
    notFound()
  }

  return (
    <article className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 px-4 sm:px-0">
          {post.title}
        </h1>
        {post.publishedAt && (
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4 sm:px-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            {new Date(post.publishedAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}
        {post.coverImageUrl && (
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 mb-6 sm:mb-8 rounded-lg overflow-hidden mx-4 sm:mx-0">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
            />
          </div>
        )}
        {post.excerpt && (
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 font-medium px-4 sm:px-0 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-img:rounded-lg px-4 sm:px-0">
          {/* In production, render TipTap JSON content here */}
          {post.contentRichText && (
            <div className="text-gray-700">
              {/* TipTap content renderer would go here */}
              <p>Contenido del post (renderizar TipTap JSON)</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

