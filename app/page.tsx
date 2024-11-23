import { MessageChecker } from '@/components/message-checker'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <h1 className="mb-8 text-4xl font-bold">FARO</h1>
      <MessageChecker />
    </div>
  )
}

