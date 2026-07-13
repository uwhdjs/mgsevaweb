import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Utensils, 
  TreePine, 
  Users, 
  Heart, 
  School, 
  Camera, 
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ACTIVITIES, IMAGES } from '../types';

const IconMap = {
  Droplets: <Droplets className="w-6 h-6 text-red-500" />,
  Utensils: <Utensils className="w-6 h-6 text-orange-500" />,
  TreePine: <TreePine className="w-6 h-6 text-green-500" />,
  Users: <Users className="w-6 h-6 text-purple-500" />,
  Heart: <Heart className="w-6 h-6 text-pink-500" />,
  School: <School className="w-6 h-6 text-blue-500" />
};

function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Blood Donation',
    'Hunger Relief',
    'Child Education',
    'Winter Relief',
    'Specially-Abled',
    'Environmental Care',
    'Healthcare Camps'
  ];

  const galleryItems = [
    { img: IMAGES.foodService, category: "Child Education", title: "Needy Persons Food Distribution", description: "Serving nutritious warm meals to families near Lucknow." },
    { img: IMAGES.distribution, category: "Blood Donation", title: "Ration & Food Kits Drive", description: "Direct supply kits delivered to laborers in need." },
    { img: IMAGES.bloodCamp, category: "Child Education", title: "Annual Blood Donation Camp", description: "Blood units mobilized to fill government hospital stocks." },
    { img: IMAGES.bloodVan, category: "Hunger Relief", title: "Blood Drive Collection Unit", description: "Convenient camps scheduled at accessible Lucknow points." },
    { img: IMAGES.gallery3, category: "Winter Relief", title: "Emergency Donor Drive", description: "Volunteers answering the call for rare blood groups." },
    { img: IMAGES.gallery4, category: "Blood Donation", title: "Donor Felicitation Event", description: "Celebrating active community heroes in Alambagh." },
    { img: IMAGES.handicapSupport, category: "Hunger Relief", title: "Wheelchair Distribution", description: "Helping physically-challenged individuals gain mobility." },
    { img: IMAGES.gallery2, category: "Specially-Abled", title: "Tricycle Aids Distribution", description: "Promoting functional independence for specially-abled Lucknow residents." },
    { img: IMAGES.education, category: "Winter Relief", title: "Free Slum Evening Classes", description: "Bringing foundational subjects and joy to young minds." },
    { img: IMAGES.gallery5, category: "Blood Donation", title: "Book & Stationery Kits", description: "Full stationery packs handed to local students." },
    { img: IMAGES.gallery6, category: "Hunger Relief", title: "Blanket Distribution Campaign", description: "Protecting footpath residents during severe winter drops." },
    { img: IMAGES.relief1, category: "Hunger Relief", title: "Warm Woolen Clothes Drive", description: "Distributing clean, warm clothing to children in slums." },
    { img: IMAGES.treePlantation, category: "Child Education", title: "Tree Planting Initiative", description: "Planting native trees to build clean Lucknow neighborhoods." },
    { img: IMAGES.gathering, category: "Hunger Relief", title: "Cleanliness Campaign", description: "Educating residents on local waste segregation." },
    { img: IMAGES.medicalCamp, category: "Healthcare Camps", title: "Free General Medical Checkups", description: "Diagnosing primary issues and educating on family hygiene." },
    { img: IMAGES.healthcare, category: "Environmental Care", title: "Essential Medicines Camp", description: "Dispensing free standard prescriptions to elderly people." },
    { img: IMAGES.communityService, category: "Community Service", title: "Active Volunteer Meetup", description: "Aligning and planning weekly social welfare programs." },
    { img: IMAGES.uploadField, category: "Environmental Care", title: "Field Visit and Survey", description: "Checking on local agricultural development initiatives." },
    { img: IMAGES.uploadStreetFood, category: "Hunger Relief", title: "Street Food Drive", description: "Serving warm nutritious street food to children." },
    { img: IMAGES.uploadBhandara, category: "Hunger Relief", title: "Bhandara Hot Food Preparation", description: "Preparing mass hot meals for community members." },
    { img: IMAGES.uploadRation, category: "Hunger Relief", title: "Ration Boxes", description: "Distributing packed food ration boxes to laborers." },
    { img: IMAGES.uploadFittingShoes, category: "Child Education", title: "School Footwear Fitting", description: "Providing properly-fitted school shoes to children." },
    { img: IMAGES.uploadClassroom, category: "Child Education", title: "Classroom Kits", description: "Distributing stationery and accessories to students." },
    { img: IMAGES.uploadHospital, category: "Healthcare Camps", title: "Compassionate Ward Visits", description: "Checking on recovering patients in general hospital wards." },
    { img: IMAGES.uploadDisabledCharity, category: "Specially-Abled", title: "Assistive Devices Charity", description: "Distributing prosthetics and support devices." },
    { img: IMAGES.uploadSapling, category: "Environmental Care", title: "Tree Planting Initiative", description: "Adding native green saplings to community areas." },
    { img: IMAGES.uploadSweater, category: "Winter Relief", title: "Sweater Distribution", description: "Providing woolen sweaters to children during winter cold." },
    { img: IMAGES.uploadBlanket, category: "Winter Relief", title: "Blanket Distribution Campaign", description: "Distributing warm blankets to pavement dwellers." }
  ];

  const filteredItems = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* Scrollable Filter Badges */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0 flex-nowrap md:flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.title + idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col group"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt="" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <p className="text-slate-400 font-medium">No moments found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default function ActivitiesPage() {
  const triggerDonationModal = (amount: number) => {
    window.dispatchEvent(new CustomEvent('open-donation-modal', { detail: { amount } }));
  };

  return (
    <div className="py-12 space-y-24 bg-[#fcfbf9]">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 bg-red-100/50 rounded-full inline-block"
        >
          OUR CAMPAIGNS
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-black text-slate-900 mt-4 tracking-tight"
        >
          What We Do on the Ground.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-medium"
        >
          From life-saving blood donation drives to critical hunger relief efforts, our campaigns serve Lucknow residents directly.
        </motion.p>
      </section>

      {/* Activities Grid */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {ACTIVITIES.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.1, duration: 0.6 }}
                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-xl transition-all"
                id={`activity-item-${idx}`}
              >
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 relative bg-slate-100 flex items-center justify-center">
                  {activity.image ? (
                    <img 
                      src={activity.image} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={activity.title} 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-slate-400/80 text-xs tracking-wider uppercase font-medium">No Image Available</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button 
                      onClick={() => triggerDonationModal(1000)}
                      className="text-white text-xs font-bold bg-red-500 px-4 py-2 rounded-xl"
                    >
                      Support This Drive
                    </button>
                  </div>
                </div>
                <div className="px-4 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 transition-colors group-hover:bg-red-500/10">
                    {IconMap[activity.iconName]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-500 transition-colors">{activity.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments of Service Photo Gallery */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-red-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <Camera className="w-4 h-4" /> PHOTO ARCHIVE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-2">Moments of Service</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-sm md:text-right">
            A real-time visual directory of our drives and direct relief services delivered in Lucknow.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <GallerySection />
      </section>

      {/* Quick Action Prompt */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold">Have an activity proposal?</h3>
            <p className="text-slate-400 text-sm">Recommend a social welfare initiative or host a donation drive in your locality in Lucknow.</p>
          </div>
          <Link 
            to="/contact" 
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-4 rounded-xl transition-all flex-shrink-0"
          >
            Propose Drive <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
