import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/more')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/more"!</div>
}
