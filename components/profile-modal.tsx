import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function ProfileModal({ isOpen, onClose, userEmail }: ProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p>
            <strong>Email:</strong> {userEmail}
          </p>
          <p>
            <strong>Account Type:</strong> Standard
          </p>
          <p>
            <strong>Member Since:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

