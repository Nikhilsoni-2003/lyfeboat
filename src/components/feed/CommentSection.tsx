import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { Comment } from './mock'
import { formatDistanceToNow } from 'date-fns'

interface CommentSectionProps {
  comments: Comment[]
  onAdd: (comment: Comment) => void
  onAfterChange?: () => void
  heightClass?: string
}

export function CommentSection({ comments, onAdd, onAfterChange, heightClass }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !onAfterChange) return
    const el = containerRef.current
    const ro = new ResizeObserver(() => onAfterChange())
    ro.observe(el)
    return () => ro.disconnect()
  }, [onAfterChange])

  const rowVirtualizer = useVirtualizer({
    count: comments.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
    overscan: 8,
  })

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      authorAvatar: 'https://i.pravatar.cc/150?img=10',
      authorDescription: 'Your current position',
      content: commentText,
      timestamp: new Date(),
    }
    onAdd(newComment)
    setCommentText('')
    onAfterChange?.()
  }

  return (
    <div ref={containerRef} className=" space-y-1 ">
      <div className="flex gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="https://i.pravatar.cc/150?img=10" alt="You" />
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
            className="sm:w-auto"
          >
            Post
          </Button>
        </div>
      </div>

      {comments.length > 0 && (
        <div
          ref={scrollRef}
          className={`sm:pl-2 mt-3 overflow-y-auto border-1 p-2 rounded-xl ${heightClass ?? 'h-64'} max-h-[200px]`}
        >
          <div
            style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const comment = comments[virtualRow.index]
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex gap-2 mt-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                      <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="bg-muted rounded-2xl px-3 py-2">
                        <h4 className="font-semibold text-xs sm:text-sm">{comment.author}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{comment.authorDescription}</p>
                        <p className="text-xs sm:text-sm break-words">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-3">
                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection


