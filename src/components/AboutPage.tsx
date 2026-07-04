import React from 'react';
import { motion } from 'motion/react';
import { Target, Heart, Award, Users, MapPin, Calendar } from 'lucide-react';
import { IMAGES } from '../types';

export default function AboutPage() {
  return (
    <div className="py-12 space-y-24 bg-[#fcfbf9]">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 font-bold uppercase tracking-[0.2em] text-xs px-3 py-1 bg-red-100/50 rounded-full inline-block"
        >
          WHO WE ARE
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-serif font-black text-slate-900 mt-4 tracking-tight"
        >
          Dedicated to the Community.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-medium"
        >
          Learn about our mission, vision, and the values driving our consistent efforts in Lucknow.
        </motion.p>
      </section>

      {/* About Deep Content Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <img src={IMAGES.healthcare} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Medical Support" referrerPolicy="no-referrer" />
              <img src={IMAGES.treePlantation} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Environment" referrerPolicy="no-referrer" />
              <img src={IMAGES.volunteer1} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Supporting Disabled" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-6 pt-12">
              <img src={IMAGES.distribution} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Relief work" referrerPolicy="no-referrer" />
              <img src={IMAGES.education} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Education" referrerPolicy="no-referrer" />
              <img src={IMAGES.medicalCamp} className="w-full aspect-[4/5] object-cover rounded-[2rem] shadow-md hover:scale-[1.02] transition-transform" alt="Medical Camp" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-12 h-1.5 bg-red-500 rounded-full mb-8" />
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              A decade of selfless service in the heart of Lucknow.
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Mangla Gauri Seva Sansthaan was born from a simple desire: to make a tangible difference in the lives of those often forgotten by society. Based in Alambagh, we've grown into a multi-faceted mission working across healthcare, hunger relief, and education.
            </p>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Our team consists of professionals, students, and citizens who believe that through consistent efforts, such as our regular blood donation camps and wheelchair distribution drives, we can uplift the entire community.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Target className="w-8 h-8 text-red-500 mb-4" />
                <h4 className="font-bold mb-2">Our Vision</h4>
                <p className="text-xs text-slate-500 leading-relaxed">To build an inclusive society where no one is left behind due to health or financial struggles.</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Heart className="w-8 h-8 text-red-500 mb-4" />
                <h4 className="font-bold mb-2">Our Mission</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Connecting generous donors with those in desperate need through transparent and efficient systems.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-red-500 font-bold uppercase tracking-widest text-xs">WHAT DRIVES US</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mt-2">Our Core Values</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Award className="w-8 h-8 text-red-500" />,
              title: "Transparency First",
              desc: "Every single rupee donated to Mangla Gauri Seva Sansthaan is accounted for and tracked with real-time receipts. We ensure absolute honesty in all public contributions."
            },
            {
              icon: <Users className="w-8 h-8 text-orange-500" />,
              title: "Community Inclusion",
              desc: "We serve everyone, regardless of background, gender, or religion. Our mission is built on universal empathy and respect for human dignity."
            },
            {
              icon: <MapPin className="w-8 h-8 text-emerald-500" />,
              title: "Direct Ground Impact",
              desc: "Our campaigns are physical and interactive. From street blanket distributions to medical camps in distant colonies, we operate on the frontlines."
            }
          ].map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 bg-slate-50 rounded-2xl w-fit mb-6">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
