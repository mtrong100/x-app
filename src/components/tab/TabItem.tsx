interface TabItemProps {
  value: string;
  activeTab: string;
  onTabClick: (value: string) => void;
  icon?: JSX.Element;
}

const TabItem = ({ value, icon, activeTab, onTabClick }: TabItemProps) => {
  let activeStyle = "";
  let hoverStyle = "";

  switch (value) {
    case "posts":
      activeStyle = "post-color";
      hoverStyle = "post-color-hover";
      break;
    case "reposts":
      activeStyle = "repost-color";
      hoverStyle = "repost-color-hover";
      break;
    case "favorite":
      activeStyle = "like-color";
      hoverStyle = "like-color-hover";
      break;

    default:
      activeStyle = "post-color";
      hoverStyle = "post-color-hover";
      break;
  }

  return (
    <div
      onClick={() => onTabClick(value)}
      className={`${
        activeTab === value ? `${activeStyle}` : `${hoverStyle}`
      } default-tab`}
    >
      {value}
      <span className="text-xl">{icon}</span>
    </div>
  );
};

export default TabItem;
