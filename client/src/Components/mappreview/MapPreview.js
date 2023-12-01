/* import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dumImg from "../../assets/img/dum.jpg";


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function MapPreview() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        height="194"
        image={dumImg}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body6" color="text.primary">
          Title
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

      </CardActions>
    </Card >
  );
} */


import React, { useState } from "react";
import "./mapPreview.css";
import dumImg from "../../assets/img/dum.jpg";
import { useNavigate } from "react-router-dom";
/* import { Popover, Text, Button, Portal } from '@mantine/core';
import '@mantine/core/styles.css'; */

const MapPreview = ({ data }) => {
  const navigate = useNavigate();
  const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);

  const handleEdit = (id) => {
    console.log("CLICKED ON MAP PREVIEW");
    navigate(`/mapdetails/${id}`);
  };

  const toggleOptionsMenu = (e) => {
    e.stopPropagation();
    setOptionsMenuVisible(!optionsMenuVisible);
  };

  const handleFork = (e) => {
    // Handle fork action
    e.stopPropagation();
    console.log("Fork clicked");
  };

  const handleShare = (e) => {
    // Handle share action
    e.stopPropagation();
    console.log("Share clicked");
  };

  const handleExport = (e) => {
    // Handle export action
    e.stopPropagation();
    console.log("Export clicked");
  };

  return (
    <div className="mappreview_container" onClick={() => handleEdit(data._id)}>
      {optionsMenuVisible && (
        <div className="mappreview_options_menu">
          <ul>
            <li className="mappreview_handle_fork" onClick={handleFork}>Fork</li>
            <li onClick={handleShare}>Share</li>
            <li onClick={handleExport}>Export</li>
          </ul>
        </div>
      )}
      {/* <Popover position="bottom" withArrow shadow="md">
        <Popover.Target>
          <Button>Toggle popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="xs">This is uncontrolled popover, it is opened when button is clicked</Text>
        </Popover.Dropdown>
      </Popover> */}
      <i onClick={toggleOptionsMenu}
        className="bi bi-three-dots-vertical"
        style={{ color: "black" }}
      ></i>
      <img className="mappreview_img" src={dumImg} alt={data.map_name} />
      <div className="mappreview_content">
        <div className="mappreview_name_container">
          <div className="mappreview_name">{data.map_name}</div>
        </div>
        <div className="mappreview_topic">{data.topic}</div>
        <div className="mappreview_count_container">
          <div className="mappreview_like">Liked by {data.map_users_liked} users</div>
          <div className="mappreview_no_comment">
            {data.map_comment_count} comments
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;
