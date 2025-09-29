import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets'
import Loading from '../../Components/Loading'
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react'
import Title from '../../Components/admin/Title'
import BlurCircle from '../../Components/BlurCircle'
import dateFormat from '../../Lib/dateFormat'   // ✅ Make sure you have this util

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  const [dashboardData, setDashboard] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  })

  const [loading, setLoading] = useState(true)

  const dashboardCards = [
    { title: 'Total Bookings', value: dashboardData.totalBookings || '0', icon: ChartLineIcon },
    { title: 'Total Revenue', value: `${currency}${dashboardData.totalRevenue || '0'}`, icon: CircleDollarSignIcon },
    { title: 'Active Shows', value: dashboardData.activeShows.length || '0', icon: PlayCircleIcon },
    { title: 'Total Users', value: dashboardData.totalUser || '0', icon: UserIcon },
  ]

  const fetchDashboardData = async () => {
    setDashboard(dummyDashboardData)
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      {/* Dashboard cards */}
      <div className="relative flex flex-wrap mt-6 gap-4">
        <BlurCircle top="-100px" left="0" />
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
          >
            <card.icon className="w-6 h-6 mb-2" />
            <h1 className="text-sm">{card.title}</h1>
            <p className="text-xl font-medium mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10px" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:translate-y-1 transition duration-300"
          >
            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="h-60 w-full object-cover"
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {currency}
                {show.showPrice}
              </p>
            </div>
            <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 px-2">
              <StarIcon className="w-4 h-4 text-primary fill-primary" />
              {show.movie.vote_average.toFixed(1)}
            </p>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default Dashboard
