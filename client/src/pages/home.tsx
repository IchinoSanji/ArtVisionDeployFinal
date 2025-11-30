import { Layout } from "@/components/layout";
import { ChatInterface } from "@/components/chat-interface";
import bgTexture from "@assets/generated_images/dark_moody_abstract_oil_painting_texture.png";

export default function Home() {
  return (
    <Layout>
      <div className="relative h-[calc(100vh-64px)] flex flex-col overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
          style={{ backgroundImage: `url(${bgTexture})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-0" />

        {/* Chat Container */}
        <div className="container mx-auto h-full relative z-10 md:px-4 md:py-6">
           <ChatInterface />
        </div>
      </div>
    </Layout>
  );
}
