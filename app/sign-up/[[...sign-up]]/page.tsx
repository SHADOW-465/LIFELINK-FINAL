import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 p-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-red-600 hover:bg-red-700 text-white',
            footerActionLink: 'text-red-600 hover:text-red-700',
            card: 'shadow-xl border-none rounded-2xl'
          }
        }}
      />
    </div>
  )
}
