import { useState, useEffect } from 'react'
import { z } from 'zod'
import { RiUser3Line } from 'react-icons/ri'
import { FiKey } from 'react-icons/fi'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { GoShieldCheck } from 'react-icons/go'
import { useNavigate } from 'react-router'
import _ from 'lodash'

import logo from '/src/assets/logo.png'
import TextInput from '/src/components/TextInput'
import Loading from '/src/components/Loading'
import { checkLogin } from '/src/services/helper'
import { ROUTES } from '/src/utils/routes.js'
import authService from '/src/services/api/AuthService'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
})

const STAGES = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
}

export default function Login() {
  let navigate = useNavigate()
  const [stage, setStage] = useState(STAGES.LOGIN)

  // login data
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  })
  const [loginTouched, setLoginTouched] = useState({
    email: false,
    password: false,
  })
  const [loginErrors, setLoginErrors] = useState({})
  /// ------------

  // register data
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [registerTouched, setRegisterTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [registerErrors, setRegisterErrors] = useState({})
  /// ------------
  const [loading, setLoading] = useState(false)

  const navigateUser = () => {
    const role = localStorage.getItem('role')
    if ('admin' === role) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }

  useEffect(() => {
    setLoading(true)
    checkLogin((flag) => {
      if (flag) {
        navigateUser()
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value })

    if (loginTouched[e.target.name]) {
      validateLogin()
    }
  }

  const handleRegisterChange = (e) => {
    setRegisterFormData({
      ...registerFormData,
      [e.target.name]: e.target.value,
    })

    if (registerTouched[e.target.name]) {
      validateRegister()
    }
  }

  const handleLoginBlur = (e) => {
    setLoginTouched({ ...loginTouched, [e.target.name]: true })
    validateLogin()
  }

  const handleRegisterBlur = (e) => {
    setRegisterTouched({ ...loginTouched, [e.target.name]: true })
    validateRegister()
  }

  const validateLogin = () => {
    const result = loginSchema.safeParse(loginFormData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setLoginErrors(fieldErrors)
    } else {
      setLoginErrors({})
    }
  }

  const validateRegister = () => {
    const result = registerSchema.safeParse(registerFormData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setRegisterErrors(fieldErrors)
    } else {
      setRegisterErrors({})
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    validateLogin()

    if (Object.keys(loginErrors).length === 0) {
      try {
        setLoading(true)
        const response = await authService.login(
          loginFormData.email,
          loginFormData.password
        )
        const data = response.data
        if ('success' === data.status) {
          localStorage.setItem('access_token', data.token)
          localStorage.setItem('user_id', data.user._id)
          localStorage.setItem('name', data.user.name)
          localStorage.setItem('email', data.user.email)
          localStorage.setItem('role', data.user.role)
        }
        navigateUser()
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    validateRegister()

    if (Object.keys(loginErrors).length === 0) {
      if (registerFormData.password !== registerFormData.confirmPassword) {
        return
      }
      try {
        setLoading(true)
        const response = await authService.register(
          registerFormData.name,
          registerFormData.email,
          registerFormData.password
        )
        const data = response.data
        if ('success' === data.status) {
          setStage(STAGES.LOGIN)
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="h-center w-screen h-screen flex relative">
      <Loading isLoading={loading} />
      <div className="md:w-1/2 w-0 md:flex justify-center items-center hidden h-full bg-primary-light">
        <div className="flex flex-col items-center">
          <img src={logo} className="w-[120px] pb-[50px]" />
          <p className="font-medium text-2xl pb-[40px]">
            Welcome to Grievance Net
          </p>
          <p className="text-center lg:w-[400px] w-[350px] text-app-dark font-light text-sm">
            Effortlessly submit and track concerns with our simple, secure, and
            user-friendly complaint portal.
          </p>
        </div>
      </div>
      <div className="md:w-1/2 w-full h-full h-center md:bg-white bg-[#fef7f4]">
        <div className="lg:w-[450px] md:w-5/6 sm:w-[400px] w-[300px]">
          <div className="md:hidden flex flex-col justify-center items-center">
            <img src={logo} className="w-[70px] mb-[20px]" />
          </div>
          {STAGES.LOGIN == stage && (
            <>
              <div className="sign-in-message pb-12">
                <p className="font-medium text-2xl pb-4">Sign in</p>
                <p className="font-light text-sm text-gray-500">
                  Enter your credentials to access the Portal.
                </p>
              </div>
              <form
                onSubmit={handleLoginSubmit}
                className="flex flex-col gap-4 mx-auto"
              >
                <div>
                  <TextInput
                    label="Email:"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    onBlur={handleLoginBlur}
                    error={loginTouched.email && loginErrors.email}
                    errorMsg={loginErrors.email}
                    leadingIcon={<MdOutlineAlternateEmail />}
                  />
                </div>
                <div>
                  <TextInput
                    label="Password:"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    onBlur={handleLoginBlur}
                    error={loginTouched.password && loginErrors.password}
                    errorMsg={loginErrors.password}
                    leadingIcon={<FiKey />}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <span className="text-sm text-app-dark">
                    Forgot password?
                  </span>
                  <span
                    className="text-sm text-primary cursor-pointer"
                    onClick={() => setStage(STAGES.REGISTER)}
                  >
                    Don't have an account?
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-sm text-white p-2 rounded"
                >
                  Login
                </button>
                <div className="h-center mt-2">
                  <span className="text-sm text-app-dark">
                    Need help? Contact{' '}
                    <span className="text-primary">grievancenet@gmail.com</span>
                  </span>
                </div>
              </form>
            </>
          )}
          {STAGES.REGISTER == stage && (
            <>
              <div className="sign-in-message pb-12">
                <p className="font-medium text-2xl pb-4">Sign up</p>
                <p className="font-light text-sm text-gray-500">
                  Enter your details to register in the Portal.
                </p>
              </div>
              <form
                onSubmit={handleRegisterSubmit}
                className="flex flex-col gap-4 mx-auto"
              >
                <div>
                  <TextInput
                    label="Name:"
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={registerFormData.name}
                    onChange={handleRegisterChange}
                    onBlur={handleRegisterBlur}
                    error={registerTouched.name && registerErrors.name}
                    errorMsg={registerErrors.name}
                    leadingIcon={<RiUser3Line />}
                  />
                </div>
                <div>
                  <TextInput
                    label="Email:"
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={registerFormData.email}
                    onChange={handleRegisterChange}
                    onBlur={handleRegisterBlur}
                    error={registerTouched.email && registerErrors.email}
                    errorMsg={registerErrors.email}
                    leadingIcon={<MdOutlineAlternateEmail />}
                  />
                </div>
                <div className="flex justify-between">
                  <div>
                    <TextInput
                      label="Password:"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={registerFormData.password}
                      onChange={handleRegisterChange}
                      onBlur={handleRegisterBlur}
                      error={
                        registerTouched.password && registerErrors.password
                      }
                      errorMsg={registerErrors.password}
                      leadingIcon={<FiKey />}
                    />
                  </div>
                  <div className="w-2"></div>
                  <div>
                    <TextInput
                      label="Confirm Password:"
                      type="password"
                      name="confirmPassword"
                      placeholder="Enter password again"
                      value={registerFormData.confirmPassword}
                      onChange={handleRegisterChange}
                      onBlur={handleRegisterBlur}
                      error={
                        registerTouched.confirmPassword &&
                        registerErrors.confirmPassword
                      }
                      errorMsg={registerErrors.confirmPassword}
                      leadingIcon={<GoShieldCheck />}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <span
                    className="text-sm text-primary cursor-pointer"
                    onClick={() => setStage(STAGES.LOGIN)}
                  >
                    Already have an account?
                  </span>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-sm text-white p-2 rounded"
                >
                  Register
                </button>
                <div className="h-center mt-2">
                  <span className="text-sm text-app-dark">
                    Need help? Contact{' '}
                    <span className="text-primary">grievancenet@gmail.com</span>
                  </span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
