import Link from 'next/link'

const Dashboard = () => {
  return (
    <div>
      <aside>
        <ul>
          <li>
            <Link href="/maps">Single Player</Link>
          </li>
        </ul>
      </aside>
      <div></div>
    </div>
  )
}

export default Dashboard
