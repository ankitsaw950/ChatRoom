import React ,{useState ,useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const Register = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser} = useContext(UserContext)
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/users/register',{
        email,
        password
    })
    .then((res)=>{
        console.log(res.data)
        localStorage.setItem('token',res.data.token)
        setUser(res.data.user)
        navigate('/')
    })
    .catch((err)=>{
        console.log(err.response.data)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
            onChange={(e)=>setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register