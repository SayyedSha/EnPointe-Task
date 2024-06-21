import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Transaction.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

export default function Transaction() {
  const [users, setUsers] = useState([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role'); // Fetch user role from local storage

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8001/api/transaction/getUserTransaction", {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        }
      });
      setUsers(response.data.userTransaction);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate('/');
          setUsers([]);
        } else {
          console.error(`Error ${error.response.status}: ${error.response.data.error}`);
          alert(`Error ${error.response.status}: ${error.response.data.error}`);
          setUsers([]);
        }
      } else {
        console.error("Error fetching users:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleOpenModal = (type) => {
    setTransactionType(type);
    if (type === 'withdraw') {
      setIsWithdrawModalOpen(true);
    } else {
      setIsDepositModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsWithdrawModalOpen(false);
    setIsDepositModalOpen(false);
    setAmount('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8001/api/transaction/${transactionType}`, { amount }, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        }
      });
      console.log(response.data);
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error(`Error ${transactionType}ing:`, error);
    }
  };

  return (
    <>
      <div className="container">
        {userRole !== 'Admin' && ( // Conditionally render the buttons
          <div className='button-container'>
            <button className="button withdraw" onClick={() => handleOpenModal('withdraw')}>Withdraw</button>
            <button className="button deposit" onClick={() => handleOpenModal('deposit')}>Deposit</button>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>TransactionId</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.transactionId}</td>
                <td>{user.credit}</td>
                <td>{user.debit}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isWithdrawModalOpen || isDepositModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Transaction Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <div style={{display:'flex'}}>
          <button type="submit" className="button submit">Submit</button>
          <button type="button" className="button cancel" onClick={handleCloseModal}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
