import { useEffect, useState } from 'react'
import { LuLogIn, LuLogOut } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'

import logo from '/src/assets/logo.png'
import AppColors from '/src/constants/AppColors'
import { ROUTES } from '/src/utils/routes'
import Loading from '/src/components/Loading'
import { checkLogin, formatDateWithSuffix } from '/src/services/helper'
import userService from '/src/services/api/UserService'

const complaintsList = [
  {
    id: 405596,
    description: 'Streetlight not working near my area.',
    date: '06/18/2023',
    category: 'Building Department',
    urgency: 'High',
    location:
      'Punjagutta Rd, Irram Manzil Colony, Punjagutta, Hyderabad, Telangana 500082',
    status: 'in-progress',
  },
  {
    id: 405162,
    description: 'Delayed response on enquiry',
    date: '06/10/2023',
    category: 'Electric Department',
    urgency: 'Low',
    location:
      '6/3/1192, Begumpet Rd, BD Colony, Kundanbagh Colony, Begumpet, Hyderabad, Telangana 500016',
    status: 'closed',
  },
  {
    id: 405043,
    description: 'Improve billing system',
    date: '05/17/2023',
    category: 'Road Department',
    urgency: 'High',
    location: 'Hussain Sagar, Khairtabad, Hyderabad, Telangana 500082',
    status: 'closed',
  },
  {
    id: 405320,
    description: 'Incorrect deduction from account',
    date: '05/09/2023',
    category: 'Sanitation Department',
    urgency: 'High',
    location:
      'railway station, 1233, PV Narasimha Rao Marg, opp. to Sanjeeviah Park, Hussain Sagar, Begumpet, Hyderabad, Telangana 500003',
    status: 'closed',
  },
  {
    id: 405343,
    description: 'Enquiry remains unresolved',
    date: '04/27/2023',
    category: 'Sewerage Department',
    urgency: 'Medium',
    location:
      'Venkateswar Colony, Bholakpur, Kavadiguda, Secunderabad, Telangana 500080',
    status: 'in-progress',
  },
  {
    id: 405345,
    description: 'Enquiry remains on building unresolved',
    date: '09/27/2023',
    category: 'Water Supply Department',
    urgency: 'Medium',
    location:
      'Venkateswar Colony, Bholakpur, Kavadiguda, Secunderabad, Telangana 500080',
    status: 'open',
  },
]

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

  const getUserComplaints = async () => {
    setLoading(true)
    try {
      const response = await userService.getComplaints(page)
      const { data } = response.data
      setComplaints(data)
      console.log(data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    checkLogin((flag) => {
      if (flag) {
        setLoggedIn(true)
        getUserComplaints()
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
          Complaint History
        </p>
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
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">
              {complaints.map((item) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
