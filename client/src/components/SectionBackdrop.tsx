import { Lightning } from './Lightning'

type SectionBackdropProps = {
  image?: string
  imageMask?: string
  imagePosition?: string
  grid?: boolean
  gridSize?: 'base' | 'sm'
  orbs?: 'violet' | 'purple' | 'both' | 'none'
  bolt?: 'violet' | 'purple' | 'none'
  spotlight?: boolean
  topFade?: boolean
  bottomFade?: boolean
  fadeHeight?: string
}

export function SectionBackdrop({
  image,
  imageMask = '',
  imagePosition = 'inset-0 h-full w-full',
  grid = false,
  gridSize = 'base',
  orbs = 'both',
  bolt = 'none',
  spotlight = false,
  topFade = false,
  bottomFade = false,
  fadeHeight = 'h-36',
}: SectionBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt=""
            className={`absolute ${imagePosition} object-cover ${imageMask}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-night/40" />
          <div className="absolute inset-0 bg-violet/15 mix-blend-multiply" />
        </div>
      )}

      {grid && (
        <div className={`absolute inset-0 ${gridSize === 'sm' ? 'bg-grid-sm' : 'bg-grid'}`} />
      )}

      <div className="bg-noise absolute inset-0" />

      {spotlight && (
        <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-96 w-[60rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-3xl" />
      )}

      {orbs === 'violet' && (
        <div className="animate-orb absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-violet/10 blur-3xl" />
      )}
      {orbs === 'purple' && (
        <div className="animate-orb-slow absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-purple/10 blur-3xl" />
      )}
      {orbs === 'both' && (
        <>
          <div className="animate-orb absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-violet/10 blur-3xl" />
          <div className="animate-orb-slow absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-purple/10 blur-3xl" />
        </>
      )}

      {bolt === 'violet' && (
        <div className="glow-bolt animate-bolt-flicker absolute right-[10%] top-16 text-violet/20">
          <Lightning className="h-14 w-14" />
        </div>
      )}
      {bolt === 'purple' && (
        <div
          className="glow-bolt animate-bolt-flicker absolute bottom-20 left-[8%] text-purple/20"
          style={{ animationDelay: '1.4s' }}
        >
          <Lightning className="h-12 w-12" variant="line" />
        </div>
      )}

      {topFade && <div className={`top-fade absolute inset-x-0 top-0 ${fadeHeight}`} />}
      {bottomFade && <div className={`bottom-fade absolute inset-x-0 bottom-0 ${fadeHeight}`} />}
    </div>
  )
}
