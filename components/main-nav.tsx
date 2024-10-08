import Link from "next/link"
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Overview
      </Link>
      <Link href="/users" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Users
      </Link>
      <Link href="/admins" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Admins
      </Link>
      <Link href="/applications" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Applications
      </Link>
      <Link href="/analytics" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Analytics
      </Link>
      <Link href="/security" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Security
      </Link>
      <Link href="/activities" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Activities
      </Link>
      <Link href="/preferences" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Preferences
      </Link>
      <Link href="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Settings
      </Link>
      <Button onClick={handleLogout} variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Logout
      </Button>
    </nav>
  )
}