import { useCallback, useEffect, useState, forwardRef } from 'react'

const OptionMachine = forwardRef(({
  options,
  onComplete,
  onChange,
  spinRate = 100,
 
  // hostMode = false
}: {
  options: { label: string; options: string[] }[]
  onComplete: (value: {
    indexes?: number[]
    values?: string[]
    obj: Record<string, string>
    // hostMode?: boolean
  }) => void
  onChange: (key: string, value: string) => void
  spinRate?: number
},  ref): React.ReactNode => {
  const [selections, setSelections] = useState(Array.from({ length: options.length }, () => 0))
  const [spinning, setSpinning] = useState(Array.from({ length: options.length }, () => false))
  const [started, setStarted] = useState(false)
  const [changeSent, setChangeSent] = useState(Array.from({ length: options.length }, () => false))
  const [completed, setCompleted] = useState(false)
  const [resultsSent, setResultsSent] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const firstSpinning = spinning.findIndex((s) => s)
      if (spinning.every((s) => !s) && started && !completed) return setCompleted(true)
      if (firstSpinning == -1) return
      setSelections((prevSelections) => {
        const nextSelections = [...prevSelections]

        for (let i = firstSpinning; i < options.length; i++) {
          const values = options[i].options
          nextSelections[i] = (nextSelections[i] + 1) % values.length
        }
        return nextSelections
      })
    }, spinRate)
    return () => clearInterval(interval)
  }, [selections, setSelections, spinning, setSpinning, options, completed, spinRate, started])

  useEffect(() => {
    console.log(changeSent, spinning, selections)
  }, [changeSent, setChangeSent, spinning, selections, options, onChange, started])

  useEffect(() => {
    console.log(completed, resultsSent)

    if (completed && !resultsSent) {
      console.log('completed')
      setResultsSent(true)
      const obj:Record<string, string> = {}
      options.forEach(({ label }, i) => {
        obj[label] = options[i].options[selections[i]]
      })
      setStarted(false)
      onComplete({
        indexes: selections,
        values: selections.map((s, i) => options[i].options[s]),
        obj
      })
    }
  }, [completed, selections, options, onComplete, resultsSent, setResultsSent])

  const handleClick = useCallback(() => {
    setSpinning((prevSpinning) => {
      const nextSpinning = [...prevSpinning]
      const firstSpinning = nextSpinning.findIndex((s) => s)
      console.log(firstSpinning)
      if (firstSpinning == -1) return prevSpinning.map(() => true)
      nextSpinning[firstSpinning] = false
      return nextSpinning
    })
    if (spinning.every((s) => !s)) {
      if (started == false) {
        setStarted(true)
        setCompleted(false)
        setResultsSent(false)
      }
      return
    }

    if (changeSent.filter((s) => s).length !== spinning.filter((s) => !s).length && started) {
      setChangeSent(() => spinning.map((s) => !s))
      if (spinning.every((s) => !s) || spinning.every((s) => s)) return
      onChange(
        options[spinning.findIndex((isSpinning) => !isSpinning)].label,
        options[spinning.findIndex((isSpinning) => !isSpinning)].options[
          selections[spinning.findIndex((isSpinning) => !isSpinning)]
        ]
      )
    }

    const firstSpinning = spinning.findIndex((s) => s)
    if (firstSpinning == -1) return
  }, [ spinning, setSpinning, started, setStarted, setCompleted, setResultsSent])

  return (
    <div
      style={{
        textAlign: 'center',
        width: '100%',
        height: '300px',
        border: '2px solid white',
        padding: '2rem',
        fontSize: 'clamp(1rem, 100rem, 4rem)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        gridGap: '1rem',
      }}
      ref={ref}
      onClick={handleClick}
    >
      {options.map(({ label, options }, i) => (
        <div
          key={label}
          style={{
            textAlign: 'center',
            width: '100%',
            height: '300px',
            border: '2px solid white',
            borderRadius: '12px',
            fontSize: 'clamp(2rem, 100rem, 4rem)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            color: spinning[i]
              ? `rgb(${Math.floor(Math.random() * 100) + 50}, 
                ${Math.floor(Math.random() * 100) + 50}, 
                ${Math.floor(Math.random() * 100) + 50})`
              : 'white',
            background: spinning[i] ? '#333333' : 'black',
            filter: spinning[i] ? 'drop-shadow(4px 4px 10px #ffffff)' : 'none'
          }}
        >
          <div style={{ textTransform: 'capitalize' }}>{options[selections[i]]}</div>
        </div>
      ))}
    </div>
  )
})

export default OptionMachine
