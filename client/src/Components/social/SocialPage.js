import React, { useEffect, useState } from "react";
import "./socialpage.css";
import SocialPostPreview from "../socialpostpreview/SocialPostPreview";
import SearchBar from "../searchbar/SearchBar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  getAllSocialPostsAPIMethod,
  getMySocialPostAPIMethod,
} from "../../api/social";
import Checkbox from "@mui/material/Checkbox";
import { grey, blueGrey } from "@mui/material/colors";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useSelector } from "react-redux";

const SocialPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilterOption, setSearchFilterOption] = useState("");
  const [displayMyPosts, setDisplayMyPosts] = useState(false);
  const [socialPosts, setSocialPosts] = useState([]);
  const searchFilterOps = ["Title", "Topics", "Description"];
  const currentUserId = useSelector((state) => state.user.id);
  const handleSeachFilter = (e) => {
    setSearchFilterOption(e.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = displayMyPosts
          ? await getMySocialPostAPIMethod(currentUserId)
          : await getAllSocialPostsAPIMethod();

        setSocialPosts(posts);
      } catch (error) {
        alert("Error fetching social posts:", error);
      }
    };
    fetchData();
  }, [displayMyPosts, currentUserId]);

  const filteredPosts = socialPosts.filter((post) => {
    return searchFilterOption === "Title"
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase())
      : searchFilterOption === "Topics"
        ? post.topic.toLowerCase().includes(searchTerm.toLowerCase())
        : post.post_content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleShowMySocialPosts = async () => {
    setDisplayMyPosts(!displayMyPosts);
  };

  return (
    <div className="socialpage">
      <div className="socialpage_container">
        <div className="socialpage_top">
          <div className="socialpostdetails_top_left">
            <h2>Social Page</h2>
          </div>
          <div className="socialpage_top_right">
            <div className="create_new_post">
              <Button
                className="create_post_btn"
                onClick={() => navigate("/createsocialpost")}
                variant="outlined"
                style={{
                  borderColor: "white",
                  color: "white",
                  marginRight: "10px",
                  width: "max-content",
                  transition: "transform 0.3s ease",
                }}
              >
                Create new post
              </Button>
            </div>
            <div className="searchbar">
              <SearchBar onSearchChange={(term) => setSearchTerm(term)} />
            </div>
            <div className="sort_by">
              <Dropdown
                options={searchFilterOps}
                value={searchFilterOption}
                placeholder="Search By.."
                className="social_page_dropdown"
                onChange={handleSeachFilter}
              />
            </div>
          </div>
        </div>
        <div className="socialpage_middle">
          <FormControlLabel
            style={{ alignSelf: "self-end", marginBottom: "1rem" }}
            value="showMySocial"
            control={
              <Checkbox
                onChange={handleShowMySocialPosts}
                sx={{
                  color: grey[800],
                  "&.Mui-checked": {
                    color: blueGrey[600],
                  },
                }}
              />
            }
            label="My Posts"
            labelPlacement="end"
            color="white"
          />
          {filteredPosts.map((item, index) => (
            <SocialPostPreview key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
