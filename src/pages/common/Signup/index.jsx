import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signupService } from '@/services/signupService'

const Signup = ({
  heading = 'MediSupplyHub.com',
  subheading = 'Sign up for free.',

  logo = {
    url: 'https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716',
    src: 'https://images-platform.99static.com//MDVqrTbdUmben2nTrA2mj8DHycw=/168x11:883x726/fit-in/500x500/99designs-contests-attachments/14/14940/attachment_14940716',
    alt: 'logo',
  },

  googleText = 'Sign up with Google',
  signupText = 'Create an account',
  loginText = 'Already have an account?',
  loginUrl = '/login',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    roleId: '8bbdfc66-b6bb-4534-8c1c-c9a3b458ea3d', // Customer role ID
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setDebugInfo(null)

    try {
      const response = await signupService.register(formData)
      console.log('Signup successful:', response)
      // Handle successful signup (e.g., navigate to login page or show success message)
      setIsLoading(false)
      navigate(loginUrl)
    } catch (error) {
      console.error('Signup failed:', error)
      setError('Signup failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <section className="py-32 px-80">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <a href={logo.url}>
                <img src={logo.src} alt={logo.alt} className="h-20 w-20" />
              </a>
              <p className="mb-2 text-2xl font-bold">{heading}</p>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {error && <p className="text-red-500">{error}</p>}
                <Input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} required disabled={isLoading} />
                <Input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
                <Input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
                <Input type="text" name="phoneNumber" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} required disabled={isLoading} />
                <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : signupText}
                </Button>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </form>
            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>{loginText}</p>
              <a href={loginUrl} className="font-medium text-primary">
                Log in
              </a>
            </div>

            {/* Debug information (only for development) */}
            {debugInfo && (
              <div className="mt-4 border-t pt-4 text-xs text-gray-500">
                <details>
                  <summary className="cursor-pointer font-bold">Debug Info (click to expand)</summary>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-gray-100 p-2">{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Signup }
