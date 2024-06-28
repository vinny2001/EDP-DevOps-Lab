// import './App.css'
import './index.css';
import Sock from "./components/Sock";
import Promo from "./components/Promo";
import sock_data from './assets/sock.json';
import promo_data from './assets/promo.json';
import Footer from './components/Footer';
import Search from './components/Search';
import React, { useState, useEffect } from "react";
import Home from './components/Home';
import About from './components/About';
import Featured from './components/Featured';
import AddSock from './components/AddSock';
import RequireAuth from './components/RequireAuth';
import LoginForm from './components/LoginForm';
import { AuthProvider } from './hooks/AuthContext';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";



function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await fetch(import.meta.env.VITE_SOCKS_API_URL);
            if (!response.ok) {
                throw new Error('Data could not be fetched!');
            }
            const json_response = await response.json();
            setData(json_response); // assign JSON response to the data variable.
        } catch (error) {
            console.error('Error fetching socks:', error);
        }
    };

    fetchData();
  }, []);
  const handleDelete = async (sockId) => {
    try {
        // Make an API request to delete the sock with the given sockId
        const response = await fetch(`${import.meta.env.VITE_SOCKS_API_URL}/${sockId}`, {
        method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Sock could not be deleted!');
        }
        // Update the state or fetch the updated data from the server
        const updatedData = data.filter(sock => sock._id !== sockId); // Remove the deleted sock from the data array
        setData(updatedData); // Update the state with the updated data
    } catch (error) {
        console.error('Error deleting sock:', error);
    }
  };
  return (
    <>
    <Router>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">TSE</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
              <Link className="nav-link" to="/">
                  Home
              </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/about">
                  About
              </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/add">
                  Add Sock
              </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
              </li>
            </ul>
            <Search setData={setData} />
          </div>
        </div>
      </nav>
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">

        <div className="container-fluid">
          <div className="row">
            <Featured data={promo_data} />
            <hr></hr>
            <AuthProvider>
            <Routes>
                <Route exact path="/" element={<Home data={data} handleDelete={handleDelete} />} />
                <Route path="/about" element={<About />} />
                <Route path="/add" element={
                  <RequireAuth>
                      <AddSock />
                  </RequireAuth>
                } />
                <Route path="/Login" element={<LoginForm />} />
            </Routes>
            </AuthProvider>
            <Footer environment={import.meta.env.VITE_ENVIRONMENT.toUpperCase()} 
            className={import.meta.env.VITE_ENVIRONMENT === "development" ? "bg-yellow" : import.meta.env.VITE_ENVIRONMENT === "production" ? "bg-green" : ""} />
          </div>
        </div>
      </main>
      </Router>
    </>
  )
}

export default App
