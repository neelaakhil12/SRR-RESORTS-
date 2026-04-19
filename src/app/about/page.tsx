import { Metadata } from "next";
import { CheckCircle2, Home, Building2, Map, ShieldCheck, Heart, Target, Eye, Gem, Clock, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the grand vision of SRR Resorts & Convention. We provide serenity, luxury, and unmatched privacy for stays and celebrations in Choutuppal.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 md:py-24 px-4 bg-srr-cream">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-dark-green mb-4 md:mb-6">About SRR Resorts</h1>
          <div className="w-20 h-1 bg-sunset-gradient mx-auto rounded-full mb-6 md:mb-8" />
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-medium">
            SRR Resort and Convention is a premium destination offering comfortable stays, event hosting, and convention facilities. It is designed for families, couples, and businesses looking for a peaceful and luxurious environment for relaxation, celebrations, and corporate gatherings.
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-sunset-start/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-brand-sunset-start" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide a sanctuary of luxury and peace where every guest experiences personalized hospitality, nature-immersed relaxation, and seamless event excellence.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the most trusted and preferred wellness and convention destination, known for our purity of service, privacy, and architectural harmony with nature.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 flex flex-col items-center text-center group hover:shadow-md transition-all">
            <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gem className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="text-2xl font-bold text-brand-dark-green mb-4">Our Values</h3>
            <p className="text-gray-600 leading-relaxed">
              Integrity in every interaction, unwavering commitment to guest privacy, and a deep-rooted respect for the environment that surrounds us.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-brand-dark-green text-white rounded-3xl p-6 md:p-12 shadow-xl mb-12 md:mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-gold mb-4 md:mb-6 text-center relative z-10">Our Grand Vision</h2>
          <div className="space-y-6 text-lg text-white/90 leading-relaxed md:text-center max-w-4xl mx-auto relative z-10">
            <p>
              Founded with a vision to provide serene luxury amidst nature, SRR Resorts & Convention stands as a beacon of hospitality and comfort. Whether you are here for a tranquil weekend getaway or to celebrate a monumental occasion, SRR guarantees an experience that is both peaceful, extraordinary, and tailored exactly to your needs.
            </p>
          </div>
        </div>

        {/* Services & Facilities Grid */}
        <div className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-dark-green mb-8 md:mb-10 text-center">World-Class Facilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <Building2 className="w-10 h-10 text-brand-sunset-start mb-4" />
              <h3 className="text-xl font-bold text-brand-dark-green mb-3">12 Luxury Rooms</h3>
              <p className="text-gray-600">
                Spanning across 3 beautifully designed floors, our 12 premium luxury rooms offer personalized care, modern amenities, scenic views, and 24/7 room service for absolute comfort.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <Home className="w-10 h-10 text-brand-submit mb-4" />
              <h3 className="text-xl font-bold text-brand-dark-green mb-3">6 Independent Houses</h3>
              <p className="text-gray-600">
                Immerse yourself in nature with our 6 exclusive independent houses. Organized in clusters of three, each cluster shares a private bonfire pit and a serene water body for the ultimate retreat.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <Map className="w-10 h-10 text-brand-gold mb-4" />
              <h3 className="text-xl font-bold text-brand-dark-green mb-3">Grand Function Hall</h3>
              <p className="text-gray-600">
                Perfect for weddings, corporate events, and large parties. We book only one event at a time to ensure your celebration receives complete privacy and dedicated staff attention.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
              <Heart className="w-10 h-10 text-brand-sunset-start mb-4" />
              <h3 className="text-xl font-bold text-brand-dark-green mb-3">Leisure & Relaxation</h3>
              <p className="text-gray-600">
                Unwind with our expansive swimming pools, scenic nature trails, and a range of indoor games. Designed to rejuvenate your mind and provide family-friendly fun.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-brand-dark-green text-white rounded-3xl p-8 md:p-16 shadow-xl relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green opacity-20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gold mb-12 text-center">Why Choose SRR Resorts?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {/* Point 1: Privacy */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-sunset-start/20 rounded-2xl flex items-center justify-center mb-2">
                  <ShieldCheck className="w-8 h-8 text-brand-sunset-start" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">Unmatched Privacy</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  We prioritize your exclusivity by booking only one major event at a time in our hall, ensuring your celebration has our undivided attention and a dedicated, private atmosphere.
                </p>
              </div>
              
              {/* Point 2: Sports */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">Sports & Outdoor Activities</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  Stay active and engaged with our premium **Swimming Pool** and professional-grade **Box Cricket** arena, designed for sports enthusiasts of all ages.
                </p>
              </div>

              {/* Point 3: Convention */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-green/30 rounded-2xl flex items-center justify-center mb-2">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">Convention Excellence</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  Our professional Convention Hall boasts a **1000+ seating capacity**, versatile staging, and modern AV support, making it the premier choice for weddings and corporate galas.
                </p>
              </div>

              {/* Point 4: Nature */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-sunset-start/20 rounded-2xl flex items-center justify-center mb-2">
                  <Home className="w-8 h-8 text-brand-sunset-start" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">Nature-First Living</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  Experience architectural harmony with our Independent Houses. Cluster A features private **bonfires**, while Cluster B offers a premium **foot pool**, both set amidst serene nature.
                </p>
              </div>

              {/* Point 5: Location */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-gold/20 rounded-2xl flex items-center justify-center mb-2">
                  <Map className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">Prime Accessibility</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  Strategically located in Choutuppal, we offer the perfect balance—accessible enough for a quick getaway from the city, yet isolated enough to provide absolute peace and quiet.
                </p>
              </div>

              {/* Point 6: Service */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-brand-green/30 rounded-2xl flex items-center justify-center mb-2">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">24/7 Premium Service</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  Whether you reside in our 12 Luxury Rooms across 3 floors or our Independent Houses, our dedicated hospitality team is available around the clock to ensure your stay is flawless.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
