// 프로젝트 관리 페이지

import {Link} from "react-router-dom";
import "./ProjectPage.css";
const ProjectPage = () => {

  // const navigate = useNavigate();

  return (
    <div className = "project-create-btn">

      <Link to={'/ProjectDetails'}>
        <div className="purple-btn">
          <h3>프로젝트 추가하기</h3>
        </div>
      </Link>
    </div>
  )
}

export default ProjectPage;