import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8001/api/user/getcurrentuserdetail", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="main">
      <h2>IDENTITY</h2>
      {user ? (
        <div className="card">
          <div className="card-body">
            <i className="fa fa-pen fa-xs edit"></i>
            <table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>:</td>
                  <td>{user.fullName}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>:</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>:</td>
                  <td>{user.phone}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>:</td>
                  <td>{user.gender}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>:</td>
                  <td>{user.role}</td>
                </tr>
                <tr>
                  <td>Created At</td>
                  <td>:</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Updated At</td>
                  <td>:</td>
                  <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
