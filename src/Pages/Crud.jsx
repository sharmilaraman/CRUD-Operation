import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import "./style.css"

function Crud() {
    const [data,setData] = useState([]);
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [address,setAddress]=useState('');
    const [editUser,setEditUser]=useState(null);

    useEffect(()=>{
        fetch(`https://jsonplaceholder.typicode.com/users`)
        .then((response)=> response.json())
        .then((userData) => setData(userData))
        .catch((err)=>console.log(err))
    },[])
    function handleUserData(){
         const userName=name.trim();
         const userEmail=email.trim();
         const userAddress=address.trim();
         if(userName && userEmail && userAddress){
            if(editUser){
               fetch(`https://jsonplaceholder.typicode.com/users/${editUser.id}`,{
                 method:"PUT",
                 headers:{
                    "Content-Type":"application/json; charset=UTF-8",
                 },
                 body:JSON.stringify({
                    name:userName,
                    email:userEmail,
                    address:{
                         city:userAddress,
                    },
                 })  
               })
               .then((res)=>res.json())
               .then((updatedUser)=> setData(data.map((user)=>user.id === updatedUser.id ? updatedUser:user))); 
               setEditUser(null);
               setName('');
               setEmail('');
               setAddress('');
            }
            else{
                //Add new user
                fetch(`https://jsonplaceholder.typicode.com/users`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json; charset=UTF-8",
                     },
                     body:JSON.stringify({
                        name:userName,
                        email:userEmail,
                        address:{
                             city:userAddress,
                        },
                     }) 
                 })
                 .then((res)=>res.json())
                 .then((newUser)=>setData([...data,newUser]))
                 setEditUser(null);
                 setName('');
                 setEmail('');
                 setAddress('');

            }
         }
    }
    function handleEdit(user){
                setName(user.name);
                setEmail(user.email);
                setAddress(user.address.city);
                setEditUser(user);
    }
    function handleDelete(id){
              fetch(`https://jsonplaceholder.typicode.com/users/${id}`,{
                method:"DELETE",
              })
              .then(()=>setData(data.filter(predata=>predata.id !==id)))
              .catch((err)=>console.log("Error occured during delete process",err));
    }
  return (
    <div className='container'>
        <h1>CRUD Operation</h1>
        
        <label>Enter User Name</label>
        <input type='text' placeholder='Enter User Name' value={name} onChange={(e)=>setName(e.target.value)}></input>
        
        <label>Enter User Email</label>
        <input type='email' placeholder='Enter User Email' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        
        <label>Enter User Address</label>
        <input type='text' placeholder='Enter User Address' value={address} onChange={(e)=>setAddress(e.target.value)}></input>
        <button onClick={handleUserData}>{editUser ? "Edit User Data" :"Add New Data "}</button>
        
        {/* <button>Add New Data </button> */}
        
        <table  border={1}>
            <tbody>
                <tr>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>User Address</th>
                    <th>Update</th>
                </tr>
            </tbody>
            <tbody>
                {
                    data.map((user,index)=>{
                        return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.address.city}</td>
                                <td>
                                    <button id='editBtn' onClick={()=>handleEdit(user)}>Edit</button>
                                    <button id='deleteBtn' onClick={()=>handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
  )
}

export default Crud