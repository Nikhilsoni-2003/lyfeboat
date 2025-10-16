import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorDescription: string;
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  authorDescription: string;
  caption: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    authorDescription: 'Product Manager at Tech Corp | Innovation Enthusiast',
    caption: 'Excited to share that our team just launched a new feature that will revolutionize how users interact with our platform. The journey has been incredible, and I couldn\'t be more proud of what we\'ve accomplished together. Special thanks to the engineering team for their dedication and hard work. This is just the beginning of something amazing! Looking forward to hearing your feedback and thoughts on this new development.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 142,
    comments: []
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    authorDescription: 'Software Engineer | Full Stack Developer | Open Source Contributor',
    caption: 'Just finished reading an amazing book on system design. Key takeaway: scalability isn\'t just about handling more traffic, it\'s about building systems that can evolve with your business needs.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: []
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    authorDescription: 'UX Designer | Creating delightful user experiences',
    caption: 'Design tip of the day: Always consider accessibility from the start, not as an afterthought. Your users will thank you for it! Today I implemented keyboard navigation in our new dashboard and it made such a difference.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 234,
    comments: []
  },
  {
    id: '4',
    author: 'David Kim',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    authorDescription: 'Tech Lead at StartupXYZ | Mentor | Speaker',
    caption: 'Had an insightful conversation with my team today about technical debt. It\'s not always about writing perfect code from day one, but about making conscious decisions and documenting them well.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    likes: 176,
    comments: []
  }
];

const READ_MORE_THRESHOLD = 200;

function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [isExpanded, setIsExpanded] = useState(false);

  const needsReadMore = post.caption.length > READ_MORE_THRESHOLD;
  const displayCaption = needsReadMore && !isExpanded
    ? post.caption.slice(0, READ_MORE_THRESHOLD) + '...'
    : post.caption;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        authorAvatar: 'https://i.pravatar.cc/150?img=10',
        authorDescription: 'Your current position',
        content: commentText,
        timestamp: new Date()
      };
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 p-4 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={post.authorAvatar} alt={post.author} />
          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">{post.author}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{post.authorDescription}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
          {displayCaption}
          {needsReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      <Separator className="my-3" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <Separator className="mb-3" />

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs sm:text-sm font-medium">Like</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs sm:text-sm font-medium">Comment</span>
        </Button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="https://i.pravatar.cc/150?img=10" alt="You" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
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
            <div className="space-y-3 pl-0 sm:pl-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
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
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function Feed() {
  return (
    <div className="w-full min-h-screen bg-background py-4 sm:py-6">
      <div className="container max-w-2xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Feed</h1>
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
