import ArtCategories from "@/components/home/ArtCategories";
import FeaturedArtworks from "@/components/home/FeaturedArtworks";
import Hero from "@/components/home/Hero";
import TopArtists from "@/components/home/TopArtists";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedArtworks/>
      <TopArtists/>
      <ArtCategories/>
    </main>
  );
}