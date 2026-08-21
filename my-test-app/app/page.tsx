import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Link href='/quote'>조회 페이지</Link>
      <br />
      <Link href='/order'>매수 페이지</Link>
    </div>
  )
}
