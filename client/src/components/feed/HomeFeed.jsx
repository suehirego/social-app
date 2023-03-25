import React from 'react';
import { useState, useEffect, useContext } from 'react';
import './feed.scss';
import Share from './Share';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Post from '../posts/Post';


const HomeFeed = ({ username }) => {


    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    


    useEffect(() => {
        const fetchPosts = async () => {
            const res = username
                ? await axios.get("http://localhost:4000/api/posts/profile/" + username)
                : await axios.get("http://localhost:4000/api/posts/timeline/" + user._id);
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            );
        };
        fetchPosts();
    }, [username, user._id]);

    


    return (
      
            <div className="feed">

                {/* //if username is equal to user.username, then you see the share component else you dont\
                 //if you are on your page you see share, if you are viewing friends, you dont */}
                {(!username || username === user.username) && <Share />}

                {posts.map((p) => (
                    <Post
                        key={p._id}
                        post={p}
                    />
                ))}

            </div>


    )
}

export default HomeFeed







