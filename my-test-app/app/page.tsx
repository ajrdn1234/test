import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href='/domestic/quote'>국내 주식 조회</Link>
      <br />
      <Link href='/overseas/quote'>해외 주식 조회</Link>
    </div>
  )
}
