// src/Pages/MyBookings.jsx
import React, { useEffect, useState } from 'react'
import { dummyBookingData, assets } from '../assets/assets'
import BlurCircle from '../Components/BlurCircle'
import isoTimeFormat from '../Lib/isoTimeFormat'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () => {
    setBookings(dummyBookingData)
    setIsLoading(false)
  }

  useEffect(() => {
    getMyBookings()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading...
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No bookings available.
      </div>
    )
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-6">MY BOOKINGS</h1>

      <div className="flex flex-col gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-3xl shadow-sm"
          >
            {/* Movie poster */}
            <img
              src={item.show.movie.poster_path || assets.placeholderImage}
              alt={item.show.movie.title || 'Movie Poster'}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />

            {/* Booking details */}
            <div className="flex flex-col p-4 flex-1">
              <p className="text-lg font-semibold">
                {item.show.movie.title || 'Unknown Movie'}
              </p>
              <p className="text-gray-400 text-sm">
                Duration: {item.show.movie.runtime || 'N/A'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Show Time:{' '}
                {item.show.showDateTime
                  ? isoTimeFormat(item.show.showDateTime)
                  : 'Not Available'}
              </p>
              {item.show.price && (
                <p className="text-gray-400 text-sm mt-1">
                  Price: {currency}
                  {item.show.price}
                </p>
              )}
            </div>

            {/* Right side info */}
            <div className="flex flex-col justify-center gap-2 text-sm md:min-w-[180px]">
              {/* Price + Pay Now button in same line */}
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold">
                  {currency}
                  {item.amount}
                </p>
                {!item.isPaid && (
                  <button className="bg-primary px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer">
                    Pay Now
                  </button>
                )}
              </div>

              {/* Total Tickets */}
              <p>
                <span className="text-gray-400">Total Tickets: </span>
                {item.bookedSeats.length}
              </p>

              {/* Seat Numbers */}
              <p>
                <span className="text-gray-400">Seat Numbers: </span>
                {item.bookedSeats.join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings
