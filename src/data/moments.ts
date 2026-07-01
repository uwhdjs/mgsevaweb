export interface Moment {
  id: string;
  title: string;
  date: string;
  description: string;
  longDescription?: string;
  image: string;
  category: 'health' | 'education' | 'environment' | 'relief' | 'empowerment' | 'general';
  stats?: { label: string; value: string }[];
}

export interface YearMoments {
  year: number;
  theme: string;
  description: string;
  highlights: string[];
  moments: Moment[];
}

export const YEARS_RANGE = [2016, 2017, 2018, 2019, 2020, 2021, 2022];

export const YEAR_WISE_MOMENTS: Record<number, YearMoments> = {
  2016: {
    year: 2016,
    theme: "The Foundation & Annapurna Seva Genesis",
    description: "Mangla Gauri Seva Sansthaan was established in Alambagh, Lucknow with a singular vision: to uplift the underprivileged through food security, health and basic support.",
    highlights: [
      "Inauguration of Mangla Gauri Seva Sansthaan in Alambagh, Lucknow",
      "Launch of 'Annapurna Seva' weekly hot food distribution",
      "Registration of the core volunteer force of 20+ dedicated citizens"
    ],
    moments: [
      {
        id: "2016-genesis",
        title: "Establishing the Seva Sansthaan",
        date: "March 2016",
        description: "Official registration and gathering of volunteers at Alambagh, establishing a community-focused sanctuary for service.",
        longDescription: "The journey of Mangla Gauri Seva Sansthaan began with a group of friends and family who witnessed daily hardships in the Alambagh area. They resolved to create a formal institution to coordinate donation drives, medical consultations, and food delivery. This initial core setup laid down the values of transparency, empathy, and persistent service.",
        image: "https://lh3.googleusercontent.com/d/1_FXGtiLbfxIKOTIXGAUKumrQuGa_jYyL",
        category: "general",
        stats: [
          { label: "Core Volunteers", value: "20+" },
          { label: "Location established", value: "Alambagh" }
        ]
      },
      {
        id: "2016-annapurna",
        title: "Launch of 'Annapurna Seva'",
        date: "June 2016",
        description: "Initiation of weekly Sunday hot meals distribution to child beggars and pavement dwellers.",
        longDescription: "Recognizing that hunger is the most pressing form of deprivation, we launched our flagship project, 'Annapurna Seva'. Starting from our Alambagh office entrance, we prepared high-quality, hot, hygienic meals and served over 100 poor citizens every single Sunday. It became a legacy of love that continues to this day.",
        image: "https://lh3.googleusercontent.com/d/16xpzfYrZSpEt7An5bJ-42o9DHc2Io6uz",
        category: "relief",
        stats: [
          { label: "Sunday Meals served", value: "4,500+" },
          { label: "Local areas covered", value: "3" }
        ]
      }
    ]
  },
  2017: {
    year: 2017,
    theme: "Healthcare Camps & Blood Donation Mobilization",
    description: "Expanding our focus from food security to healthcare, 2017 marked the launch of our massive free health consultation camps and systematic blood donation drives in Lucknow.",
    highlights: [
      "First Mega Free Health Camp in Alambagh serving 350+ patients",
      "Partnered with state blood banks to launch donor registries",
      "Initiated annual 'Winter Shield' blanket distributions"
    ],
    moments: [
      {
        id: "2017-healthcamp",
        title: "First Mega Free Healthcare Camp",
        date: "February 2017",
        description: "Bringing specialist pediatricians, general physicians, and gynecologists to serve local slum dwellers.",
        longDescription: "In association with civic-minded doctors, we converted a local community center into a free clinic for a weekend. Patients received complete checkups, diagnostic testing advice, and free prescription medicines. For many, it was their first real interaction with qualified healthcare professionals.",
        image: "https://lh3.googleusercontent.com/d/1HhUPBIIPkAapAHotXrHVS6oNcBh0KWEO",
        category: "health",
        stats: [
          { label: "Patients Treated", value: "350+" },
          { label: "Free Medicines Given", value: "₹45k+ worth" }
        ]
      },
      {
        id: "2017-blood-drive",
        title: "Inaugural Community Blood Drive",
        date: "August 2017",
        description: "Emergency blood collection drive to address local hospital deficits during dengue season.",
        longDescription: "To counter severe blood shortages in local government hospitals in Lucknow, we mobilized youth volunteers. Over 50 units of blood were collected in a single day, cementing our strong partnership with government hospital blood banks.",
        image: "https://lh3.googleusercontent.com/d/1nagW4m1xGi4WSACn9OGlSxiKobOg6NL2",
        category: "health",
        stats: [
          { label: "Blood Units Collected", value: "52" },
          { label: "Registered Donors", value: "120+" }
        ]
      }
    ]
  },
  2018: {
    year: 2018,
    theme: "Specially-Abled Dignity & 'Green Lucknow' Campaign",
    description: "In 2018, we prioritised mobility and environmental stewardship, introducing physical aids to the disabled and launching large-scale tree plantations.",
    highlights: [
      "Distributed wheelchairs and tricycles to specially-abled individuals",
      "Planted 500+ indigenous trees to preserve Alambagh's canopy",
      "Introduced community sanitation and hygiene sessions"
    ],
    moments: [
      {
        id: "2018-mobility",
        title: "Divyangjan Mobility Aid Distribution",
        date: "April 2018",
        description: "Empowering differently-abled citizens with custom tri-cycles, crutches, and wheelchairs.",
        longDescription: "Through support from generous donors, we hosted a dignity distribution event. We identified 30+ individuals with mobility challenges and equipped them with robust manual tricycles and customized wheelchairs. This restored their independence, enabling several to resume work and support their families.",
        image: "https://lh3.googleusercontent.com/d/1KAkkFGRQA_m7TeHnQwaUQKVIH029rQ6U",
        category: "empowerment",
        stats: [
          { label: "Wheelchairs & Tricycles", value: "35" },
          { label: "Beneficiary Families", value: "35" }
        ]
      },
      {
        id: "2018-green-alambagh",
        title: "Green Canopy Tree Plantation Drive",
        date: "July 2018",
        description: "Planting neem, banyan, and peepal trees across parks and roadsides to combat urban heat.",
        longDescription: "To counter Lucknow's rising urban temperatures, our youth wing initiated the 'Green Alambagh' project. Volunteers planted 500 saplings in Alambagh, Alambagh Railway Colony, and local schools, securing commitments from residents to water and safeguard them.",
        image: "https://lh3.googleusercontent.com/d/1oMs7qizlDQuaacqWMI2_eeK9klsILD38",
        category: "environment",
        stats: [
          { label: "Saplings Planted", value: "500+" },
          { label: "Survival Rate", value: "85%" }
        ]
      }
    ]
  },
  2019: {
    year: 2019,
    theme: "Education Empowerment & Digital Literacy",
    description: "Recognizing education as the strongest weapon against generational poverty, 2019 saw the inception of our 'Shiksha Sahayata' children support scheme.",
    highlights: [
      "Supported 120+ street children with educational starter kits",
      "Sponsored secondary school fees for 15 bright students",
      "Initiated weekend basic remedial classes for slum kids"
    ],
    moments: [
      {
        id: "2019-shiksha",
        title: "Launching 'Shiksha Sahayata' Kits",
        date: "May 2019",
        description: "Distributing school bags, notebooks, geometric sets, and stationery to students.",
        longDescription: "To prevent school dropouts due to minor financial burdens, we equipped 120 primary school kids with sturdy school bags filled with custom study materials. This kept the joy of learning alive and relieved struggling parents of basic schooling expenses.",
        image: "https://lh3.googleusercontent.com/d/1ZTtCPrerpI_O1kNkYsl1-o6sauydzfcw",
        category: "education",
        stats: [
          { label: "Kits Distributed", value: "120+" },
          { label: "Schools Impacted", value: "4" }
        ]
      },
      {
        id: "2019-slum-education",
        title: "Remedial Classes for Street Children",
        date: "October 2019",
        description: "Bridging learning gaps through weekly basic mathematics, reading, and hygiene lessons.",
        longDescription: "We set up an open-air classroom in local slums, where our volunteer teachers tutored children who missed out on early formal schooling. Focused on reading, writing, and basic life skills, this program successfully mainstreamed 18 kids into formal government schools.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
        category: "education",
        stats: [
          { label: "Weekly Students", value: "45+" },
          { label: "Mainstreamed to Schools", value: "18" }
        ]
      }
    ]
  },
  2020: {
    year: 2020,
    theme: "COVID-19 Humanitarian Crisis Intervention",
    description: "The pandemic brought unprecedented challenges. Our team pivoted overnight to full-scale emergency relief, feeding families and distributing sanitization gear.",
    highlights: [
      "Distributed 10,000+ dry ration kits to stranded migrant workers",
      "Conducted hygiene awareness and distributed 15,000+ free masks",
      "Collaborated with city administration to locate vulnerable families"
    ],
    moments: [
      {
        id: "2020-ration-distribution",
        title: "Emergency Dry Ration Distribution",
        date: "April - September 2020",
        description: "Sustaining thousands of daily-wage families with rice, flour, pulses, oil, and spices.",
        longDescription: "When the lockdown struck, daily-wage earners lost their livelihoods in an instant. Risking personal health, our team established secure packaging centers. We distributed comprehensive monthly dry food ration kits directly to households in major slums, ensuring no family slept hungry.",
        image: "https://lh3.googleusercontent.com/d/1kR_rf0EMOoooTP9LYRzhVzTxN5Bym21O",
        category: "relief",
        stats: [
          { label: "Ration Kits Distributed", value: "10,000+" },
          { label: "Families Sustained", value: "4,000+" }
        ]
      },
      {
        id: "2020-mask-hygiene",
        title: "Lockdown Relief and Mask Distribution",
        date: "May 2020",
        description: "Providing washable masks, soaps, sanitizers, and sanitizing public community hubs.",
        longDescription: "To stop the virus spread in dense community settlements, we distributed high-quality double-layered cotton masks handmade by local self-help groups. We also taught proper handwashing techniques and sanitized high-touch surfaces in congested Alambagh narrow lanes.",
        image: "https://lh3.googleusercontent.com/d/1HMY4Foq8onQJbTTZ-S1YlwWSvgyfOvD3",
        category: "relief",
        stats: [
          { label: "Masks Distributed", value: "15,000+" },
          { label: "Sanitization Drives", value: "30+" }
        ]
      }
    ]
  },
  2021: {
    year: 2021,
    theme: "Oxygen Response & Launch of Seva Rasoi",
    description: "During the devastating second wave, we worked on oxygen supply coordination, and later launched the 'Seva Rasoi' community kitchen.",
    highlights: [
      "Coordinated emergency oxygen cylinder distribution to critical patients",
      "Inaugurated 'Seva Rasoi' providing hygienic hot meals",
      "Organized post-COVID medical rehabilitation consultations"
    ],
    moments: [
      {
        id: "2021-oxygen-coordination",
        title: "Emergency Oxygen Coordination Network",
        date: "April - June 2021",
        description: "Saving lives through critical oxygen cylinder sourcing and free refilling support.",
        longDescription: "As the second wave overwhelmed hospitals, our team established a 24/7 hotline. We collected, refilled, and delivered oxygen cylinders directly to the homes of patients fighting for breath. This direct intervention helped stabilize hundreds of patients during the absolute peak of the crisis.",
        image: "https://lh3.googleusercontent.com/d/1UHFvuXEMlecLidzX8PqLbOZBKymkss-z",
        category: "health",
        stats: [
          { label: "Oxygen Cylinders Sourced", value: "180+" },
          { label: "Emergency Calls Handled", value: "2,500+" }
        ]
      },
      {
        id: "2021-seva-rasoi",
        title: "Seva Rasoi Community Kitchen Launch",
        date: "November 2021",
        description: "Inaugurating our permanent community kitchen offering hot nutritious meals for free.",
        longDescription: "To address permanent post-COVID economic distress, we established 'Seva Rasoi'. It serves freshly cooked, hot, balanced meals consisting of rice, dal, and vegetables to anyone walking in, completely free. This ensured ongoing dignity and nutrition.",
        image: "https://lh3.googleusercontent.com/d/1WOXeu4naHk4NUlV_d-fN_A7pb14aAaH3",
        category: "relief",
        stats: [
          { label: "Daily Meals Served", value: "150+" },
          { label: "Months Active", value: "Continuous" }
        ]
      }
    ]
  },
  2022: {
    year: 2022,
    theme: "Mobile Blood Donation Van & Scaled Healthcare",
    description: "2022 saw our dreams of expanding mobility in healthcare take shape with the acquisition of our dedicated Mobile Blood Donation Van.",
    highlights: [
      "Acquisition and deployment of the Mobile Blood Donation Van",
      "Hosted our largest festival community feast (Bhandara) serving 5,000+",
      "Launched digital blood donor database for rapid hospital coordination"
    ],
    moments: [
      {
        id: "2022-mobile-van",
        title: "Launching the Mobile Blood Donation Van",
        date: "August 2022",
        description: "Bringing blood donation facilities right to colleges, corporate offices, and residential sectors.",
        longDescription: "To make blood donation incredibly accessible, we custom-designed a Mobile Blood Donation Van. Equipped with comfortable donor beds, refrigeration, and testing kits, the van travels across Lucknow, collecting vital life-saving blood safely and professionally.",
        image: "https://lh3.googleusercontent.com/d/1v9E0atC8sJxTdTBTtYp-QKZospj9z4dU",
        category: "health",
        stats: [
          { label: "Van Camps Held", value: "40+" },
          { label: "Blood Units Collected", value: "1,200+" }
        ]
      },
      {
        id: "2022-mega-bhandara",
        title: "Mega Festival Bhandara",
        date: "October 2022",
        description: "Hosting a grand community kitchen feast on Dussehra, spreading joy and community harmony.",
        longDescription: "Celebrating the spirit of unity, we held a massive public feast (B Bhandara). Over 5,000 people from all walks of life sat together in Alambagh to enjoy a festive meal of puri, sabzi, and halwa, illustrating our vision of a barrier-free, loving society.",
        image: "https://lh3.googleusercontent.com/d/1plBN9RKgwSQHNdGd97uFOt8zibQ917DO",
        category: "relief",
        stats: [
          { label: "People Fed in 1 Day", value: "5,000+" },
          { label: "Volunteers active", value: "85" }
        ]
      }
    ]
  }
};
