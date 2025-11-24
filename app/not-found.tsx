import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <CardContent className="pt-8 text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">404</h1>
          <p className="text-xl text-slate-300 mb-2">Page Not Found</p>
          <p className="text-slate-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700">Return to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
