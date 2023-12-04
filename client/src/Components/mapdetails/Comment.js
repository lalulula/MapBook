import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { getAllUsersAPIMethod } from "../../api/user";
import FlexBetween from "../FlexBetween";

const Comment = ({ comment }) => {
  const [users, setUsers] = useState([]);
  const [isCommentOptions, setIsCommentOptions] = useState(false);

  const getUsers = async () => {
    const data = await getAllUsersAPIMethod();
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, [users]);

  const toggleCommentOptions = (e) => {
    e.stopPropagation();
    setIsCommentOptions(!isCommentOptions);
  };

  if (!users) {
    return (
      <></>
    )
  } else {
    return (
      <Box mb="20px">
        {users.filter(user => user._id === comment.map_comment_owner).map((user, i) => (
          <FlexBetween key={user._id + i}>
            <Box width="15%" alignSelf="start" mt="7px">
              <img style={{width: "35px", height: "35px", borderRadius: "50%"}} src={user.profile_img}/>
            </Box>
            <Box width="85%">
              <Box 
                borderRadius="0 15px 15px 15px"
                p="10px"
                mb="5px"
                backgroundColor="#323643"
              >
                <FlexBetween mb="10px">
                  <Box>
                    <Typography fontSize="18px" fontWeight="bold" color="whitesmoke">
                      {user.username}
                    </Typography>
                  </Box>
                  <Box position="relative">
                    {isCommentOptions && (
                      <Box 
                        position="absolute" 
                        top="15px"
                        padding="5px"
                        borderRadius="5px"
                        zIndex="1"
                        width="150px"
                        backgroundColor="rgb(191, 238, 250)"
                        color="black"
                      >
                        <ul style={{listStyle: "none", margin: "0", padding: "0"}}>
                          <li style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}>
                            Edit
                          </li>
                          <li style={{cursor: "pointer", padding: "5px 10px", transition: "background-color 0.3s"}}>
                            Delete
                          </li>
                        </ul>
                      </Box>
                    )}
                    <i onClick={toggleCommentOptions}
                      className="bi bi-three-dots-horizontal"
                      style={{ color: "gray" }}
                    ></i>
                  </Box>
                </FlexBetween>

                <Typography fontSize="16px" color="whitesmoke">
                  {comment.map_comment_content}
                </Typography>
              </Box>

              <FlexBetween ml="20px" width="22%">
                <Typography 
                  fontSize="12px"
                  fontWeight="bold"
                  color="#dadada"
                >
                  Reply
                </Typography>
              </FlexBetween>
            </Box>
          </FlexBetween>
        ))}
      </Box>
    )
  }
}

export default Comment;