import React, { useRef, useState } from 'react'
import YouTube from 'react-youtube'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const extractYouTubeId = (url = '') => {
  const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return m ? m[1] : null
}

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])
  const playerRef = useRef(null)              // store YT player instance
  const shouldAutoplayRef = useRef(false)     // mark user's intent
  const [embedBlocked, setEmbedBlocked] = useState(false)

  const videoId = extractYouTubeId(currentTrailer?.videoUrl || '')

  const opts = {
    height: '540',
    width: '960',
    playerVars: {
      autoplay: 0,          // we call playVideo from onReady when user clicked
      controls: 1,
      rel: 0,
      modestbranding: 1,
      origin: window.location.origin,
      // enablejsapi is handled by the library
    }
  }

  const onPlayerReady = (event) => {
    // event.target is the youtube player object (YT.Player)
    playerRef.current = event.target
    console.log('YouTube player ready for id:', videoId)

    if (shouldAutoplayRef.current) {
      // try to play only when iframe is ready
      try {
        event.target.playVideo()
        shouldAutoplayRef.current = false
        setEmbedBlocked(false)
      } catch (err) {
        console.error('playVideo() failed', err)
        // if it's blocked, set fallback indicator
        setEmbedBlocked(true)
      }
    }
  }

  const onPlayerError = (e) => {
    console.error('YouTube player error', e)
    // e.data gives error code; we treat as embed/block issue and show fallback
    setEmbedBlocked(true)
  }

  const onThumbClick = (trailer) => {
    setEmbedBlocked(false)
    shouldAutoplayRef.current = true
    setCurrentTrailer(trailer)
    // clear previous playerRef — new onReady will set it
    playerRef.current = null
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

      <div className="relative mt-6 flex justify-center">
        <BlurCircle top="-100px" right="-100px" />

        <div className="w-[960px] h-[540px] bg-black rounded overflow-hidden flex items-center justify-center">
          {videoId ? (
            <>
              {/* react-youtube iframe */}
              <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                onError={onPlayerError}
                className="mx-auto"
              />

              {embedBlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-auto">
                  <div className="bg-black/70 text-white p-3 rounded">Embedding blocked or failed. Open in YouTube:</div>
                  <a
                    href={currentTrailer.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-black px-4 py-2 rounded"
                  >
                    Open in YouTube
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400">Invalid video URL</div>
          )}
        </div>
      </div>

      <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image ?? trailer.videoUrl}
            className="relative hover:translate-y-1 duration-300 transition max-md:h-60 cursor-pointer"
            onClick={() => onThumbClick(trailer)}
          >
            <img src={trailer.image} alt={trailer.title ?? 'trailer'} className="rounded-lg w-full h-full object-cover brightness-75" />
            <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailerSection