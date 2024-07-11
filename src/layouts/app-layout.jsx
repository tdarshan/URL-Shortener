import { Outlet } from "react-router-dom"
import Header from "@/components/Header"

const AppLayout = () => {
  return (
    <div>
        <main className="min-h-screen container">
            {/* Header */}
            <Header />
            
        
            <Outlet></Outlet>
        </main>

        <div className="p-10 text-center bg-gray-700 mt-10">
        {/* footer */}
        Made with 🥰 by Darshan.
        </div>
    </div>
  )
}

export default AppLayout