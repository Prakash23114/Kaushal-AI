
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './Features/auth/context/auth.context.jsx'
import { InterviewProvider } from './Features/interview/context/interview.context.jsx'
import { ThemeProvider } from './context/theme.context.jsx'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
