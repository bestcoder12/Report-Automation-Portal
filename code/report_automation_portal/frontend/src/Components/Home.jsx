import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div>Sitemap</div>
      <div>
        <Link to="/login" />
        Login
      </div>
    </>
  );
}
