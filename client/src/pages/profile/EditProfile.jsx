import React from 'react';
import { useState, useContext } from 'react';
import './edit.scss';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {

    const { user, dispatch } = useContext(AuthContext);
    const [success, setSuccess] = useState(false);

    const [person, setPerson] = useState({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        tagline: user.tagline,
        jobTitle: user.jobTitle,
        employer: user.employer,
        city: user.city,
        school: user.school,
    });


    const handleChange = (e) => {
        setPerson((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_START" });
        const updatedUser = {
            userId: user._id,
            ...person,
        };
        try {
            const res = await axios.put("http://localhost:4000/api/users/" + user._id, updatedUser);
            setSuccess(true);
            dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
            navigate(`/profile/${user.username}`);
        } catch (err) {
            dispatch({ type: "UPDATE_FAILURE" });
        }

    }


    return (

        <div className="edit">
            <h3>Edit your Profile</h3>

            <form className="editProfileWrapper" onSubmit={handleSubmit}>

                <div className="editBottom">
                    <div className="editBottomItem">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={person.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            value={person.firstname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            value={person.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={person.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>Tagline</label>
                        <textarea
                            rows={6}
                            name="tagline"
                            value={person.tagline}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>Job Title</label>
                        <input
                            type="text"
                            placeholder={user.jobTitle}
                            name="jobTitle"
                            value={person.jobTitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>Employer</label>
                        <input
                            type="text"
                            name="employer"
                            value={person.employer}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>City</label>
                        <input
                            type="text"
                            name="city"
                            value={person.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="editBottomItem">
                        <label>School</label>
                        <input
                            type="text"
                            name="school"
                            value={person.school}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="updateBtn">Update</button>
                    {success && <span style={{ color: 'green' }}>Profile has been updated!</span>}

                </div>

            </form>


        </div>
    )
}

export default EditProfile
