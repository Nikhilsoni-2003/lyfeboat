import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Post } from './mock'
import { CommentSection } from './CommentSection'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

const READ_MORE_THRESHOLD = 140

export const PostCard = React.memo(({
  post,
  commentsCount,
  onToggleComments,
  onSizeChange,
  onFocusPost,
}: {
  post: Post
  commentsCount: number
  onToggleComments: () => void
  onSizeChange?: () => void
  onFocusPost?: () => void
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isExpanded, setIsExpanded] = useState(false)
  const { ref: imgRef, isInView } = useIntersectionObserver<HTMLImageElement>()

  const needsReadMore = post.caption.length > READ_MORE_THRESHOLD
  const displayCaption = needsReadMore && !isExpanded
    ? post.caption.slice(0, READ_MORE_THRESHOLD) + '...'
    : post.caption

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1))
  }

  // const initialComments: Comment[] = post.comments

  return (
    <Card className="w-full max-w-2xl mx-auto p-5 sm:p-6 " onClick={onFocusPost}
    >
      <div className="flex items-start gap-3 mb-1image.png">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={post.authorAvatar} alt={post.author} />
          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0" onClick={onFocusPost}>
          <h3 className="font-semibold text-sm sm:text-base truncate">{post.author}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{post.authorDescription}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="mb-1">
        <img
          ref={imgRef}
          src={isInView ? (post.imageUrl ?? '/office-building.png') : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg=='}
          loading="lazy"
          decoding="async"
          onLoad={() => setTimeout(() => onSizeChange?.(), 0)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            if (target.src.endsWith('/office-building.png')) return
            target.src = '/office-building.png'
            // ResizeObserver on the row will handle re-measure
          }}
          alt="post"
          className="w-full rounded-lg object-cover max-h-[420px]"
          onClick={(e) => { e.stopPropagation(); onFocusPost?.() }}
        />
      </div>

      <div>
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words" onClick={(e) => { e.stopPropagation(); onFocusPost?.() }}>
          {displayCaption}
          {needsReadMore && (
            <button
            onClick={() => {
              setIsExpanded(!isExpanded)
              setTimeout(() => onSizeChange?.(), 0)
            }}
              className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      <Separator className="my-1" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <Separator className="mb-1" />

      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleLike() }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs sm:text-sm font-medium">Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2"
          onClick={(e) => {
            e.stopPropagation()
            onToggleComments()
            setTimeout(() => onSizeChange?.(), 0)
          }}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs sm:text-sm font-medium">Comment</span>
        </Button>
      </div>
    </Card>
  )
})


