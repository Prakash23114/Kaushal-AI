
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './Features/auth/context/auth.context.jsx'
import { InterviewProvider } from './Features/interview/context/interview.context.jsx'

function App() {


  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}></RouterProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
