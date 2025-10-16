import { MOCK_POSTS, type Post, type Comment } from './mock'
import React, { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'


const PostCard = lazy(() => import('./PostCard').then(module => ({ default: module.PostCard })))
const CommentSection = lazy(() => import('./CommentSection').then(module => ({ default: module.CommentSection })))

// Skeleton components for loading states
const PostCardSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="w-full h-64 rounded-lg mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="flex gap-3 mt-4">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
)

const CommentSectionSkeleton = () => (
  <div className="w-full max-w-2xl mx-auto p-4">
    <div className="space-y-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
)

export function Feed() {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const rowElMapRef = useRef<Record<number, HTMLDivElement | null>>({})
  const rowObserverMapRef = useRef<Record<number, ResizeObserver | null>>({})
  const [openPostId, setOpenPostId] = useState<string | null>(null)
  const [focusPostId, setFocusPostId] = useState<string | null>(null)
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({})
  const [visibleCount, setVisibleCount] = useState<number>(15)

  const allPosts = useMemo(() => MOCK_POSTS, [])
  const slicedPosts = useMemo(() => allPosts.slice(0, visibleCount), [allPosts, visibleCount])

  const feedPosts: Post[] = useMemo(() => {
    if (focusPostId) {
      const p = allPosts.find(p => p.id === focusPostId)
      return p ? [p] : []
    }
    return slicedPosts
  }, [allPosts, focusPostId, slicedPosts])

  const visibleRows = useMemo(() => {
    const rows: Array<{ type: 'post' | 'comments'; post: Post }> = []
    for (const post of feedPosts) {
      rows.push({ type: 'post', post })
      if (openPostId === post.id || focusPostId === post.id) {
        rows.push({ type: 'comments', post })
      }
    }
    return rows
  }, [feedPosts, openPostId, focusPostId])

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = visibleRows[index]
      if (row.type === 'comments') return 260
      
      // Better size estimation based on content length
      const captionLength = row.post.caption.length
      const baseHeight = 200
      const captionHeight = Math.ceil(captionLength / 50) * 20
      const imageHeight = row.post.imageUrl ? 420 : 0
      const interactionHeight = 120
      
      return baseHeight + captionHeight + imageHeight + interactionHeight
    },
    overscan: 8, 
  })

  const maybeLoadMore = useCallback(() => {
    if (focusPostId) return
    const el = parentRef.current
    if (!el) return
    const thresholdPx = 600
    const nearEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - thresholdPx
    if (nearEnd) {
      setVisibleCount((prev) => (prev >= allPosts.length ? prev : Math.min(prev + 15, allPosts.length)))
    }
  }, [allPosts.length, focusPostId])

  useEffect(() => {
    const el = parentRef.current
    if (!el) return
    const handler = () => maybeLoadMore()
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [maybeLoadMore])

  return (
    <div className="w-full min-h-screen bg-background py-4 sm:py-6">
      {/* <StructuredData posts={feedPosts} /> */}
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Feed</h1>
          {focusPostId && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setFocusPostId(null)
                setOpenPostId(null)
                setTimeout(() => rowVirtualizer.scrollToIndex(0), 0)
              }}
            >
              Back to feed
            </Button>
          )}
        </div>

        <div
          ref={parentRef}
          className="h-[720px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent relative py-1"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = visibleRows[virtualRow.index]
              return (
                <div
                  key={virtualRow.key}
                  ref={(el) => {
                    const index = virtualRow.index
                    rowElMapRef.current[index] = el

                    //  Disconnect previous observer if any
                    if (rowObserverMapRef.current[index]) {
                      rowObserverMapRef.current[index]?.disconnect()
                      rowObserverMapRef.current[index] = null
                    }

                    if (el) {
                      // Initial measure
                      rowVirtualizer.measureElement(el)

                      // Attach ResizeObserver to track height changes
                      const ro = new ResizeObserver(() => {
                        rowVirtualizer.measureElement(el)
                      })
                      ro.observe(el)
                      rowObserverMapRef.current[index] = ro
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="pb-1">
                    {row.type === 'post' ? (
                      <Suspense fallback={<PostCardSkeleton />}>
                        <PostCard
                          post={row.post}
                          commentsCount={(commentsMap[row.post.id] ?? row.post.comments).length}
                          onToggleComments={() => {
                            setOpenPostId((prev) => (prev === row.post.id ? null : row.post.id))
                            const el = rowElMapRef.current[virtualRow.index]
                            if (el) rowVirtualizer.measureElement(el)
                          }}
                          onSizeChange={() => {
                            const el = rowElMapRef.current[virtualRow.index]
                            if (el) rowVirtualizer.measureElement(el)
                          }}
                          onFocusPost={() => {
                            setFocusPostId(row.post.id)
                            setOpenPostId(row.post.id)
                          }}
                        />
                      </Suspense>
                    ) : (
                      <Suspense fallback={<CommentSectionSkeleton />}>
                        <CommentSection
                          comments={commentsMap[row.post.id] ?? row.post.comments}
                          onAdd={(c) => {
                            setCommentsMap((prev) => {
                              const existing = prev[row.post.id] ?? row.post.comments
                              return { ...prev, [row.post.id]: [...existing, c] }
                            })
                          }}
                          onAfterChange={() => {
                            const el = rowElMapRef.current[virtualRow.index]
                            if (el) rowVirtualizer.measureElement(el)
                          }}
                          heightClass={focusPostId ? 'h-[420px]' : 'h-64'}
                        />
                      </Suspense>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed
