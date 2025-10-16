import { createFileRoute } from '@tanstack/react-router'
import { Feed } from '@/components/Feed'

export const Route = createFileRoute('/_auth/feed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Feed />
}
