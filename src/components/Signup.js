import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const {showAlert} = props;
  const [credentials, setCredentials] = useState({name:"",email: "", password: "", cpassword: ""}) 
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: credentials.name ,email: credentials.email, password: credentials.password})
    });
    const json = await response.json()
    console.log(json);
    
    if (json.success){
        // Save the auth token and redirect
        localStorage.setItem('token', json.token); 
        navigate("/");                    // replaces history.push(target)
        showAlert("Account Created Successfully");


    }
    else{
        showAlert("invalid Credentials");
    }
}


const onChange = (e)=>{
    setCredentials({...credentials, [e.target.name]: e.target.value})
}
  return (
    
    <div> <h2>Create Your Account</h2><div className='container w-60' ><form onSubmit={handleSubmit}>
    
  <div className="row mb-3">
    <label for="inputEmail3" className="col-sm-2 col-form-label">Name</label>
    <div className="col-sm-10">
      <input type="name" name = "name" className="form-control" id="name" onChange={onChange}/>
    </div>
  </div>
  <div className="row mb-3">
    <label for="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input type="email" className="form-control" id="email" name="email" onChange={onChange}/>
    </div>
  </div>
  <div className="row mb-3">
    <label for="inputEmail3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input type="password" className="form-control" id="password"  name = "password" onChange={onChange}/>
    </div>
  </div>
  <div className="row mb-3">
    <label for="inputPassword3" className="col-sm-2 col-form-label">Confirm Password</label>
    <div className="col-sm-10">
      <input type="password" class = "form-control" id="cpassword" name='cpassword' onChange={onChange}/>
    </div>
  </div>
 
  <button type="submit" className="btn btn-primary" >Sign up</button>
</form></div>


</div>
  )
}

export default Signup