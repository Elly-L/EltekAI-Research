import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black/80 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 EltekAI. All rights reserved.</p>
          </div>
          <div>
            <p>
              Developed by{" "}
              <Link href="https://eltek.netlify.app" className="text-purple-400 hover:underline">
                Eltek
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

