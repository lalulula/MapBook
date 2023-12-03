import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./maptools.css";
import likes from "../../assets/img/heart.png";
import comments from "../../assets/img/chat.png";
import fork from "../../assets/img/document.png";
import edit from "../../assets/img/edit.png";
import exportt from "../../assets/img/upload.png";
import share from "../../assets/img/send.png";
import line from "../../assets/img/line.png";
import upload from "../../assets/img/open-folder.png";
import undo from "../../assets/img/undo.png";
import redo from "../../assets/img/redo.png";
import visible from "../../assets/img/visible.png";
import invisible from "../../assets/img/invisible.png";
import save from "../../assets/img/save.png";
import dl from "../../assets/img/delete (1).png";
import liked from "../../assets/img/love.png";
import { likeMapAPIMethod } from "../../api/map";



const MapTools = ({ style, isEdit, currentMap }) => {
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true);
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(currentMap.map_users_liked.includes(user._id));
  }, [currentMap]);

  const likeMap = async () => {
    const userId = {
      userId: user._id,
    }
    likeMapAPIMethod(currentMap._id, isAuth, userId).catch((err) => {
      console.error("Error updating user:", err.message);
    });
  };


  return isEdit ?
    <div className="map_tools" style={style}>
      <div className="tool">
        <div className="tool_title">Upload</div>
        <img src={upload} alt="Upload" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Undo</div>
        <img src={undo} alt="Undo" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Redo</div>
        <img src={redo} alt="Redo" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        {isPublic &&
          <div className="visibility" onClick={() => setIsPublic(false)}>
            <div className="tool_title">Public</div>
            <img src={visible} alt="Visible" />
          </div>
        }
        {!isPublic &&
          <div className="visibility" onClick={() => setIsPublic(true)}>
            <div className="tool_title">Private</div>
            <img src={invisible} alt="Invisible" />
          </div>
        }
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Save</div>
        <img src={save} alt="Save" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Delete</div>
        <img src={dl} alt="Delete" />
      </div>
    </div> :
    <div className="map_tools" style={style}>
      <div className="tool" onClick={likeMap}>
        <div className="tool_title">{currentMap.map_users_liked.length}</div>
        {isLiked ? <img src={liked} alt="Likes" /> : <img src={likes} alt="Likes" />}
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Comments</div>
        <img src={comments} alt="Comment" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Fork</div>
        <img src={fork} alt="Fork" />
      </div>

      <img src={line} alt="line" />


      <div className="tool" onClick={() => navigate(`/editmap/${currentMap._id}`)}>
        <div className="tool_title">Edit</div>
        <img src={edit} alt="Edit" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Export</div>
        <img src={exportt} alt="Export" />
      </div>

      <img src={line} alt="line" />

      <div className="tool">
        <div className="tool_title">Share</div>
        <img src={share} alt="Share" />
      </div>
    </div>
}

export default MapTools;