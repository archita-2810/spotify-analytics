import Image from "next/image";
import Header from "@/components/navbar/header";

export default function Home() {
  return (
    <div className="font-poppins relative min-h-screen flex flex-col overflow-hidden">
      <div className='relative z-20'>
        <Header/>
      </div>
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="blob left-[10%] top-[20%] animate-blob animation-delay-2000"></div>
        <div className="blob right-[10%] bottom-[20%] animate-blob animation-delay-4000"></div>
        <div className="blob left-[50%] top-[50%] animate-blob animation-delay-6000"></div>
      </div>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg z-10"></div>
    </div>
  );
}
