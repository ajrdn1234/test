'use client'

import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState<string>('주식')

  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      {text}
    </div>
  )
}
