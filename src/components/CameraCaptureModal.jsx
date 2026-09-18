import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, RefreshCw, Check, X, SwitchCamera, AlertCircle } from 'lucide-react'
import Button from './Button'

/**
 * CameraCaptureModal — Real-time live camera capture for OPD Kiosks & tablets
 * Uses navigator.mediaDevices.getUserMedia with front/back toggle and canvas snapshot.
 */
export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
}) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // 'user' | 'environment'
  const [cameraError, setCameraError] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      stopCamera()
      setCapturedImage(null)
      setCameraError(null)
      return
    }

    startCamera(facingMode)

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  const startCamera = async (mode) => {
    setIsInitializing(true)
    setCameraError(null)
    stopCamera()

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsInitializing(false)
    } catch (err) {
      console.warn('Camera stream error, trying fallback:', err)
      try {
        // Fallback to any available video track
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(fallbackStream)
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream
        }
        setIsInitializing(false)
      } catch (fallbackErr) {
        console.error('Camera access failed completely:', fallbackErr)
        setCameraError('Unable to access camera. Please check camera permissions.')
        setIsInitializing(false)
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleTakePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    setCapturedImage(dataUrl)
    stopCamera()
  }

  const handleRetake = () => {
    setCapturedImage(null)
    startCamera(facingMode)
  }

  const handleConfirm = () => {
    if (!capturedImage) return

    // Convert dataURL to File
    fetch(capturedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File(
          [blob],
          `camera-scan-${Date.now()}.jpg`,
          { type: 'image/jpeg' }
        )
        onCapture(file, capturedImage)
        handleClose()
      })
  }

  const handleClose = () => {
    stopCamera()
    setCapturedImage(null)
    onClose()
  }

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-x-hidden overflow-y-auto w-full max-w-[100vw]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden max-w-xl w-full max-w-[calc(100vw-1.5rem)] border border-slate-700 shadow-2xl flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-2 text-white">
              <Camera className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-sm sm:text-base font-heading">
                {capturedImage ? 'Review Captured Document' : 'Document Camera Viewfinder'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!capturedImage && !cameraError && (
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Switch Camera"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Viewfinder / Capture Area */}
          <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
            {cameraError ? (
              <div className="text-center p-6 text-slate-400">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white mb-1">Camera Not Available</p>
                <p className="text-xs max-w-xs mx-auto mb-4">{cameraError}</p>
                <Button variant="outline" size="sm" onClick={() => startCamera(facingMode)}>
                  Retry Access
                </Button>
              </div>
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Medical Document"
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Document Alignment Frame Guides */}
                <div className="absolute inset-6 border-2 border-dashed border-teal-400/70 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-teal-400 text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded w-fit">
                    <span>ALIGN DOCUMENT EDGES</span>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-xs text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                      Hold steady under good lighting
                    </span>
                  </div>
                </div>

                {isInitializing && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs">
                    Initializing camera stream...
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
            {capturedImage ? (
              <>
                <Button
                  variant="outline"
                  size="md"
                  icon={RefreshCw}
                  onClick={handleRetake}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  Retake Photo
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={handleConfirm}
                  className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20"
                >
                  Use This Document
                </Button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isInitializing || cameraError}
                  onClick={handleTakePhoto}
                  className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-teal-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center mx-auto"
                >
                  <div className="w-13 h-13 rounded-full border-2 border-slate-900 bg-teal-500 flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
                <div className="w-12" /> {/* Spacer */}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
