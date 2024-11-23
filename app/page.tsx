import { MessageChecker } from '@/components/message-checker'

export default function Home({
  searchParams,
}: {
  searchParams: { shared?: string }
}) {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <h1 className="mb-8 text-4xl font-bold">FARO</h1>
      <MessageChecker initialShared={searchParams.shared === 'true'} />
    </div>
  )
}

