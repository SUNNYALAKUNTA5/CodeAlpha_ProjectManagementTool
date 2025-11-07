import {useNavigate} from 'react-router-dom';
const Error = () => {
  const Navigate = useNavigate();
  return (
    <div className="vh-100 d-flex flex-column 
         justify-content-center align-items-center
         bg-light text-center p-4 "
    >
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h2 className="fw-semibold text-dark">Oops Page Not Found 😕</h2>
      <p className="text-secondary mb-4">The page you are looking for might have been moved or deleted</p>
      <button className="btn btn-primary btn-lg px-4 shadow-sm" onClick={()=>Navigate("/")}>Go Back Home</button>
      <p className='text-muted mt-4'><i className='bi bi-compass'>Keep Exploring Our Site</i></p>
    </div>
  )
}

export default Error