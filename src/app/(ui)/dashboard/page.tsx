import Link from 'next/link'

const Dashboard = () => {
  return (
    <div>
      <aside>
        <ul>
          <li>
            <Link href="/single-player">Single Player</Link>
          </li>
          <li>
            <Link href="/multi-player">Multi Player</Link>
          </li>
          <li>
            <Link href="/maps">Classic Maps</Link>
          </li>
        </ul>
      </aside>
      <div></div>
    </div>
  )
}

export default Dashboard
