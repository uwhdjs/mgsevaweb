import React from 'react';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const rawImages = {
  treePlantation: "https://lh3.googleusercontent.com/d/14kCOgRuVi6zc89HtVjBvKISdUz8igob8",
  bloodVan: "https://lh3.googleusercontent.com/d/1v9E0atC8sJxTdTBTtYp-QKZospj9z4dU",
  education: "https://lh3.googleusercontent.com/d/1ZTtCPrerpI_O1kNkYsl1-o6sauydzfcw",
  distribution: "https://lh3.googleusercontent.com/d/1kR_rf0EMOoooTP9LYRzhVzTxN5Bym21O",
  bloodCamp: "https://lh3.googleusercontent.com/d/1plBN9RKgwSQHNdGd97uFOt8zibQ917DO",
  healthcare: "https://lh3.googleusercontent.com/d/1nagW4m1xGi4WSACn9OGlSxiKobOg6NL2",
  bannerKids: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
  handicapSupport: "https://lh3.googleusercontent.com/d/1KAkkFGRQA_m7TeHnQwaUQKVIH029rQ6U",
  foodService: "https://lh3.googleusercontent.com/d/16xpzfYrZSpEt7An5bJ-42o9DHc2Io6uz",
  logo: "https://lh3.googleusercontent.com/d/1HW5ouARgO2-kRuawJOktm8afqhh_BdB1",
  gallery1: "https://lh3.googleusercontent.com/d/1_FXGtiLbfxIKOTIXGAUKumrQuGa_jYyL",
  gallery2: "https://lh3.googleusercontent.com/d/12UaXzNet0ZzVVEDWOMXk1QuJfv5ESNOS",
  gallery3: "https://lh3.googleusercontent.com/d/1rrRZ13jmL4GLTXBDt4UnqUleHEQRpkWD",
  gallery4: "https://lh3.googleusercontent.com/d/1H_BSJJQqzMwPIb6rPdnx2CbK6wEIDr5k",
  gallery5: "https://lh3.googleusercontent.com/d/1B1pWQ_nkMLwMJGUfzTp7KnRVNjaeUmSH",
  communityService: "https://lh3.googleusercontent.com/d/1w0G-hxirOls8MrTyHiJyVdESda7dqs4p",
  medicalCamp: "https://lh3.googleusercontent.com/d/1HhUPBIIPkAapAHotXrHVS6oNcBh0KWEO",
  volunteer1: "https://lh3.googleusercontent.com/d/1UHFvuXEMlecLidzX8PqLbOZBKymkss-z",
  relief1: "https://lh3.googleusercontent.com/d/1HMY4Foq8onQJbTTZ-S1YlwWSvgyfOvD3",
  gathering: "https://lh3.googleusercontent.com/d/17v_5m2wDqGHeThg5Ba8gBqheh8z1SSz-",
  gallery6: "https://lh3.googleusercontent.com/d/1Cpk5xmHMMJkjItkbrenv6fE-YzrQi9Ax",
  gallery7: "https://lh3.googleusercontent.com/d/1g-ktQGifp3_fcXtEVn8gr0IeDxmrM5_-",
  uploadField: "https://lh3.googleusercontent.com/d/1s7kkVOmkMIuUF9Lbc2Yn3nn-4eUTiekg",
  uploadStreetFood: "https://lh3.googleusercontent.com/d/1nyMNCEhBESUSk9YtupaMI4dZhA89fdrH",
  uploadBhandara: "https://lh3.googleusercontent.com/d/1dG_nNMGKo9xYptqEiqasqFsuxeawPydU",
  uploadRation: "https://lh3.googleusercontent.com/d/1vh6B6VpbQcjpg5RXjkm4yVeusy834LVp",
  uploadFittingShoes: "https://lh3.googleusercontent.com/d/1WwVv_KCksvBZVyyugCc0LWaKDOb5zegl",
  uploadClassroom: "https://lh3.googleusercontent.com/d/1yp3FVxOq3bzvAnTTpFoAvxyJW3OSS7er",
  uploadHospital: "https://lh3.googleusercontent.com/d/1AY0onyFhnArj02R-UhFdI4SsvwS2CUHQ",
  uploadDisabledCharity: "https://lh3.googleusercontent.com/d/1KAkkFGRQA_m7TeHnQwaUQKVIH029rQ6U",
  uploadSapling: "https://lh3.googleusercontent.com/d/1rrRZ13jmL4GLTXBDt4UnqUleHEQRpkWD",
  uploadSweater: "https://lh3.googleusercontent.com/d/1HMY4Foq8onQJbTTZ-S1YlwWSvgyfOvD3",
  uploadBlanket: "https://lh3.googleusercontent.com/d/1Cpk5xmHMMJkjItkbrenv6fE-YzrQi9Ax"
};

export function getProxiedOrDirectUrl(url: string): string {
  if (!url) return '';
  
  if (url.includes("lh3.googleusercontent.com") || url.includes("drive.google.com")) {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
    if (url.includes("lh3.googleusercontent.com")) {
      return url;
    }
  }
  
  return url;
}

export const IMAGES = Object.fromEntries(
  Object.entries(rawImages).map(([key, value]) => [
    key,
    getProxiedOrDirectUrl(value)
  ])
) as typeof rawImages;

export interface ActivityType {
  title: string;
  description: string;
  iconName: 'Droplets' | 'Utensils' | 'TreePine' | 'Users' | 'Heart' | 'School';
  image: string;
}

export const ACTIVITIES: ActivityType[] = [
  {
    title: "Winter Relief",
    description: "Distributing warm clothes and blankets to help the underprivileged survive the harsh winter nights in Lucknow.",
    iconName: "Heart",
    image: IMAGES.uploadBhandara
  },
  {
    title: "Blood Donation Camps",
    description: "Regularly organizing camps to ensure a steady supply of blood to those in need, saving countless lives through community action.",
    iconName: "Droplets",
    image: IMAGES.gallery4
  },
  {
    title: "Hunger Relief",
    description: "Providing nutrition through community feasts and regular food distribution drives in slums and for those struggling in Alambagh, Lucknow.",
    iconName: "Utensils",
    image: IMAGES.relief1
  },
  {
    title: "Environmental Care",
    description: "Actively participating in plantation drives to keep our city green and combat climate change.",
    iconName: "TreePine",
    image: IMAGES.treePlantation
  },
  {
    title: "Supporting Disabled",
    description: "Empowering our specially-abled brothers and sisters through mobility support distributions and community inclusion.",
    iconName: "Users",
    image: IMAGES.gallery2
  },
  {
    title: "Child Education",
    description: "Reaching out to children in local schools to provide stationery, books, and educational guidance for a brighter future.",
    iconName: "School",
    image: IMAGES.uploadClassroom
  }
];

export const TESTIMONIALS = [
  {
    name: "Amit Srivastava",
    text: "The blood donation camp organized by Mangla Gauri Seva Sansthaan saved my father's life during a critical emergency. The volunteers were extremely cooperative and arranged the blood unit instantly in Lucknow.",
    location: "Alambagh, Lucknow"
  },
  {
    name: "Suman Lata",
    text: "Under their Child Education program, my daughter received stationery, books, and regular guidance. They are doing incredible work for the children of underprivileged families in our slum area.",
    location: "LDA Colony, Lucknow"
  },
  {
    name: "Ravi Kishan",
    text: "I attended their blanket distribution drive in extreme winter. It was heartbreakingly beautiful to see how carefully and respectfully they distributed warm blankets to everyone sleeping on the cold Lucknow streets.",
    location: "Singar Nagar, Lucknow"
  },
  {
    name: "Preeti Verma",
    text: "I received a wheelchair during their mobility support distribution campaign. It has given me my independence and dignity back. I am deeply grateful to the entire team of volunteers.",
    location: "Kanpur Road, Lucknow"
  },
  {
    name: "Rohan Gupta",
    text: "The events organized by them are not only about giving or distributing but also about teamwork, discipline, safety, and community participation. It is a meaningful experience to support this Lucknow initiative.",
    location: "Deoria, Uttar Pradesh"
  }
];
