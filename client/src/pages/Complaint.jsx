import { useEffect, useState } from 'react'
import { LuLogIn, LuLogOut } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { z } from 'zod'

import logo from '/src/assets/logo.png'
import AppColors from '/src/constants/AppColors'
import Loading from '/src/components/Loading'
import { checkLogin } from '/src/services/helper'
import { ROUTES } from '/src/utils/routes'
import TextArea from '/src/components/TextArea'
import complaintService from '/src/services/api/ComplaintService'

const complaintSchema = z.object({
  location: z.string().min(5, 'Location is required'),
  description: z.string().min(5, 'Description is required'),
  urgency: z.string().optional(),
})

export default function Complaint() {
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const [complaintFormData, setComplaintFormData] = useState({
    location: '',
    description: '',
  })
  const [complaintTouched, setComplaintTouched] = useState({
    location: false,
    description: false,
  })
  const [complaintErrors, setComplaintErrors] = useState({})

  const handleComplaintChange = (e) => {
    setComplaintFormData({
      ...complaintFormData,
      [e.target.name]: e.target.value,
    })

    if (complaintTouched[e.target.name]) {
      validateComplaint()
    }
  }

  const handleComplaintBlur = (e) => {
    setComplaintTouched({ ...complaintTouched, [e.target.name]: true })
    validateComplaint()
  }

  const validateComplaint = () => {
    const result = complaintSchema.safeParse(complaintFormData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setComplaintErrors(fieldErrors)
    } else {
      setComplaintErrors({})
    }
  }

  const handleComplaintSubmit = async (e) => {
    e.preventDefault()
    validateComplaint()

    if (Object.keys(complaintErrors).length === 0) {
      try {
        setLoading(true)
        const response = await complaintService.submit(
          complaintFormData.location,
          complaintFormData.description,
          complaintFormData.urgency
        )
        console.log(response.data)
        navigate(ROUTES.HOME, { replace: true })
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    checkLogin((flag) => {
      if (flag) {
        setLoading(false)
        setLoggedIn(true)
      } else {
        navigate(ROUTES.AUTH, { replace: true })
      }
    })
  }, [])

  return (
    <div className="relative h-screen">
      <Loading isLoading={loading} />
      <div className="app-header flex justify-between py-3 px-5 bg-[#fef7f4] shadow-md">
        <div className="px-4 h-center">
          <img src={logo} className="w-[44px]" />
          <p className="pl-4 font-light text-lg">Grievance Net</p>
        </div>
        <div className="h-center">
          <Link to={ROUTES.COMPLAINT}>
            <button className="hover:scale-[1.01] bg-primary text-sm text-white p-2 px-5 rounded">
              Submit Complaint
            </button>
          </Link>
          {!loggedIn ? (
            <Link to={ROUTES.AUTH}>
              <button className="hover:scale-[1.01] h-center ml-5 px-2 bg-white text-sm ring-2 ring-orange-500 p-1 rounded">
                <span className="pr-1 app-text-dark">Login</span>
                <LuLogIn color={AppColors.text} size={18} />
              </button>
            </Link>
          ) : (
            <div
              onClick={() => {
                localStorage.clear()
                navigate(ROUTES.AUTH, { replace: true })
              }}
            >
              <button className="hover:scale-[1.01] h-center ml-5 px-2 bg-white text-sm ring-2 ring-orange-500 p-1 rounded">
                <span className="pr-1 app-text-dark">Logout</span>
                <LuLogOut color={AppColors.text} size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="px:-8 md:px-16 lg:px-24 pt-20">
        <p className="pb-2 text-2xl font-medium text-app-dark">
          Submit a new complaint
        </p>
        <p className="font-light text-sm text-gray-500">
          Provide the details of your issue so our team can review and take
          timely action.
        </p>
        <form
          onSubmit={handleComplaintSubmit}
          className="flex flex-col gap-4 mx-auto mt-8"
        >
          <TextArea
            label="Location:"
            name="location"
            placeholder="Enter location"
            rows="4"
            value={complaintFormData.location}
            onChange={handleComplaintChange}
            onBlur={handleComplaintBlur}
            error={complaintTouched.location && complaintErrors.location}
            errorMsg={complaintErrors.location}
          />
          <TextArea
            label="Description:"
            name="description"
            placeholder="Enter description"
            value={complaintFormData.description}
            onChange={handleComplaintChange}
            onBlur={handleComplaintBlur}
            error={complaintTouched.description && complaintErrors.description}
            errorMsg={complaintErrors.description}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary w-[300px] text-sm text-white p-2 rounded"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
