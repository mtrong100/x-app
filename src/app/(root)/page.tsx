import {
  CmtIcon,
  HeartIcon,
  RetweetIcon,
  ShareIcon,
} from "@/components/icons/Icon";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <div>
        <h1 className="font-semibold text-xl">Home</h1>
        <div className="mt-5 flex items-center border-b border-text_2 pb-2">
          <div className="flex-1 text-center relative p-3 hover:bg-darkHover rounded-lg cursor-pointer font-medium">
            For you
          </div>
          <div className="flex-1 text-center p-3 hover:bg-darkHover rounded-lg cursor-pointer font-medium">
            Following
          </div>
        </div>
      </div>

      <div className="border-b border-text_2 pb-2 mt-3">
        <div className="flex items-start gap-2">
          <div className="w-[45px] hover:opacity-70 h-[45px] rounded-full flex-shrink-0">
            <Image
              className="rounded-full  img-cover"
              src="https://source.unsplash.com/random"
              width={100}
              height={100}
              alt="user-avatar"
            />
          </div>
          <textarea
            className="flex-1 p-2 bg-transparent outline-none  resize-none"
            placeholder="What is happening?!"
          />
        </div>
        <button className="font-medium text-white hover:bg-opacity-80 flex ml-auto bg-primaryColor rounded-full py-2 px-5">
          Post
        </button>
      </div>

      {/* Post item */}
      <div className="flex flex-col gap-10 mt-3">
        {Array(5)
          .fill(0)
          .map((item, index) => (
            <div key={index} className="border-b border-text_2">
              <div className="flex items-center flex-1 gap-3">
                <div className="w-[38px] hover:opacity-70 h-[38px] rounded-full flex-shrink-0">
                  <Image
                    className="rounded-full  img-cover"
                    src="https://source.unsplash.com/random"
                    width={100}
                    height={100}
                    alt="user-avatar"
                  />
                </div>
                <div className="flex gap-1 items-center flex-1">
                  <h4 className="font-semibold text-white hover:underline">
                    mityoya
                  </h4>
                  <span className="text-text_4 text-sm">@mitoya</span>
                  <span>.</span>
                  <span className="text-text_4 text-sm">9/8/2023</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente molestias quibusdam nam? Sapiente, nobis ducimus
                  voluptatum, soluta quisquam reprehenderit consequuntur, labore
                  dignissimos et earum officiis aperiam quidem repellat
                  laudantium atque.
                </p>
                <div className="w-full h-[500px] mt-4">
                  <Image
                    className="img-cover rounded-md"
                    src="https://source.unsplash.com/random"
                    width={300}
                    height={300}
                    alt="post-image"
                  />
                </div>
              </div>
              <div className="flex items-center gap-5  justify-around py-4">
                <div className="flex items-center gap-3 px-5">
                  <span>
                    <CmtIcon />
                  </span>
                  <span>19</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    <HeartIcon />
                  </span>
                  <span>19</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    <RetweetIcon />
                  </span>
                  <span>19</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    <ShareIcon />
                  </span>
                  <span>19</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
