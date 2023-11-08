import { useState, useEffect } from "react";
import { getUserAPIMethod } from "../../api/client";

import "./profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    // getting current user
    /* useEffect(() => {
        getUserAPIMethod().then((u) => {
            console.log("user set in profile.js");
            setUser(u);
        })
    }, []); */

    return (
        <div className="profile">
            <div className="profile_container">
                <div className="profile_top">
                    <div className="profile_left">
                        <img className="profile_img" src="https://us-tuna-sounds-images.voicemod.net/d347dbc8-e6b8-4f85-bb64-8dcb234f5730-1674067639225.jpg"></img>
                        <div className="editImg">Upload/Change</div>
                    </div>

                    <div className="profile_right">
                        <div className="username_container">
                            <h5>Username</h5>
                            <div className="username">{user && (
                                <div>{user.username}</div>
                            )}</div>
                            <div className="username">{!user && (
                                <div>No user</div>
                            )}</div>
                        </div>
                        <div className="name_container">
                            <h5>Name</h5>
                            <div className="name">Name goes here</div>
                        </div>
                        <div className="email_container">
                            <h5>email</h5>
                            <div className="email">{user && (
                                <div>{user.email}</div>
                            )}</div>
                            <div className="email">{!user && (
                                <div>No user</div>
                            )}</div>
                        </div>
                    </div>
                </div>
                <div className="profile_bottom">
                    <div className="logout">logout</div>
                    <div className="remove_account">remove account</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;