import { Lightning } from './Lightning'

export function TitleBolt() {
  return (
    <div className="relative mb-6 flex items-center justify-center">
      <div className="h-px w-24 bg-gradient-to-l from-transparent via-violet/50 to-transparent" />
      <span className="glow-bolt absolute text-purple">
        <Lightning className="h-5 w-5" />
      </span>
    </div>
  )
}
