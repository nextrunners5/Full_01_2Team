import './css/rightSidebar.css';

interface RightSidebarProps {
  onAddButtonClick: () => void; // 일정 추가 버튼 클릭 핸들러
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onAddButtonClick }) => {
  return (
    <div className="rightSidebar">
      <div className="dateContainer">
        <p>{new Date().toLocaleDateString()}</p>
        <button className="styled-button" onClick={onAddButtonClick}>
          + 일정
        </button>
      </div>
      <p>오른쪽 사이드바 내용</p>
    </div>
  );
};

export default RightSidebar;
