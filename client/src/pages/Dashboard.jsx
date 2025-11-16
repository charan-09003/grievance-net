import { useEffect, useState } from 'react'
import { LuLogIn, LuLogOut } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'

import logo from '/src/assets/logo.png'
import AppColors from '/src/constants/AppColors'
import { ROUTES } from '/src/utils/routes'
import Loading from '/src/components/Loading'
import { checkLogin, formatDateWithSuffix } from '/src/services/helper'
import adminService from '/src/services/api/AdminService'

const statusClasses = {
  'in-progress': 'bg-orange-100 text-orange-600',
  closed: 'bg-green-100 text-green-700',
  open: 'bg-blue-100 text-blue-600',
}

const statusStrings = {
  'in-progress': 'In Progress',
  closed: 'Closed',
  open: 'Open',
}

const urgencyClasses = {
  High: 'bg-rose-100 text-rose-800',
  Medium: 'bg-orange-100 text-orange-600',
  Low: 'bg-green-100 text-green-600',
}

export default function Home() {
  let navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState(1)

  const getAllComplaints = async () => {
    setLoading(true)
    try {
      const response = await adminService.getAllComplaints(page)
      const { data } = response.data
      setComplaints(data)
      console.log(data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const changeStatus = async (index, complaintId, status) => {
    setLoading(true)
    try {
      const response = await adminService.setComplaintStatus(
        complaintId,
        status
      )
      const data = response.data
      console.log(data)
      if ('success' === data.status) {
        complaints[index].status = status
        setComplaints(complaints)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    checkLogin((flag) => {
      const role = localStorage.getItem('role')
      if (flag) {
        if ('admin' === role) {
          setLoggedIn(true)
          getAllComplaints()
        } else {
          navigate(ROUTES.HOME, { replace: true })
        }
      } else {
        navigate(ROUTES.AUTH, { replace: true })
      }
    })
  }, [])

  return (
    <div className="relative">
      <Loading isLoading={loading} />
      <div className="app-header flex justify-between py-3 px-5 bg-[#fef7f4] shadow-md">
        <div className="px-4 h-center">
          <img src={logo} className="w-[44px]" />
          <p className="pl-4 font-light text-lg">Grievance Net</p>
        </div>
        <div className="h-center">
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
        <p className="pb-2 text-2xl font-medium text-app-dark">All Complaint</p>
        <p className="font-light text-sm text-gray-500">
          Track your previous complaints' submissions below.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="py-3 px-5 text-left truncate">Submitted On</th>
                <th className="py-3 px-5 text-left">Description</th>
                <th className="py-3 px-5 text-left">Department</th>
                <th className="py-3 px-5 text-left">Urgency</th>
                <th className="py-3 px-5 text-left">Location</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">
              {complaints.map((item, index) => (
                <tr key={item._id} className="border-t">
                  <td className="py-3 px-5 text-center">
                    {formatDateWithSuffix(item.created_at)}
                  </td>
                  <td className="py-3 px-5">{item.description}</td>
                  <td className="py-3 px-5 truncate">
                    {item.predicted_category}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs truncate ${
                        urgencyClasses[item.urgency] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-5">{item.location}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs truncate ${
                        statusClasses[item.status] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {statusStrings[item.status] || item.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    {'open' === item.status && (
                      <button
                        onClick={() =>
                          changeStatus(index, item._id, 'in-progress')
                        }
                        className="truncate hover:scale-[1.01] ring-2 ring-[#f26e4288] text-xs text-app-dark p-1 px-3 rounded"
                      >
                        Set In Progress
                      </button>
                    )}
                    {'in-progress' === item.status && (
                      <button
                        onClick={() => changeStatus(index, item._id, 'closed')}
                        className="truncate hover:scale-[1.01] ring-2 ring-[#f26e4288] text-xs text-app-dark p-1 px-3 rounded"
                      >
                        Close Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
