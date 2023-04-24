import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  const goBack = () => navigate('/');

  return (
    <>
      <div>The access to this page is unauthorized</div>
      <div>
        <input type="button" onClick={goBack} value="Go back" />
      </div>
    </>
  );
}
