      <div className="grid grid-cols-3 mt-5 border-b border-text_2">
        {tabData.map((item: TTabData) => (
          <li
            key={item.value}
            onClick={() => setTabSelected(item.value)}
            className={`${
              tabSelected === item.value
                ? "border-b-4 border-primaryColor  bg-primaryColor bg-opacity-10 text-primaryColor rounded-tl-md rounded-tr-md"
                : "bg-transparent hover:bg-darkHover border-transparent"
            } flex items-center space-x-2 w-full py-3 justify-center border-b-4  transition-all cursor-pointer relative`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </li>
        ))}
      </div>
