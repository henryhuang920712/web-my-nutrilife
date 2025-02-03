import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* 背景圖片 */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/homepage/1.jpg" // 記得圖片路徑正確
          alt="Hero"
          layout="fill"
          objectFit="cover" /* 確保圖片完全覆蓋容器 */
          quality={100}
        />
      </div>

      {/* 黑色背景層與內容 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-semibold">Welcome to our website</h1>
          <h3 className="text-lg mt-4">We provide the best services</h3>
          <div className="mt-6">
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">
              Get started
            </button>
            <button className="ml-4 bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
