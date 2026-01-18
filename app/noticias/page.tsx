import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Calendar } from 'lucide-react'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Noticias - Vicky',
  description: 'Últimas noticias y actualizaciones sobre comercio exterior',
}

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  return posts
}

export default async function NoticiasPage() {
  const posts = await getPosts()

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center text-gray-900 px-4">
          Noticias
        </h1>
        {posts.length === 0 ? (
          <p className="text-center text-gray-600 text-sm sm:text-base px-4">No hay noticias publicadas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.coverImageUrl && (
                  <div className="relative h-40 sm:h-48 md:h-56 bg-gray-200">
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {new Date(post.publishedAt).toLocaleDateString('es-AR')}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

