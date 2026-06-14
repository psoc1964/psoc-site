// "use client";

// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// interface GalleryImage {
//   src: string;
//   alt: string;
//   caption?: string;
// }

// interface LensGalleryProps {
//   images: GalleryImage[];
// }

// export default function LensGallery({ images }: LensGalleryProps) {
//   const galleryRef = useRef<HTMLDivElement | null>(null);
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   useEffect(() => {
//     if (!galleryRef.current) return;

//     const ctx = gsap.context(() => {
//       // Parallax scroll for each image
//       gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, index) => {
//         const img = item.querySelector(".gallery-img");
        
//         // Staggered reveal
//         gsap.fromTo(
//           item,
//           { 
//             opacity: 0, 
//             y: 80,
//             scale: 0.9,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 1.2,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: item,
//               start: "top 85%",
//             },
//             delay: index * 0.15,
//           }
//         );

//         // Image zoom on scroll
//         gsap.to(img, {
//           scale: 1.2,
//           ease: "none",
//           scrollTrigger: {
//             trigger: item,
//             start: "top bottom",
//             end: "bottom top",
//             scrub: 1.5,
//           },
//         });
//       });
//     }, galleryRef);

//     return () => ctx.revert();
//   }, []);

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
//     const item = e.currentTarget;
//     const rect = item.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
    
//     const rotateX = ((y - centerY) / centerY) * -8;
//     const rotateY = ((x - centerX) / centerX) * 8;

//     gsap.to(item, {
//       rotateX,
//       rotateY,
//       duration: 0.4,
//       ease: "power2.out",
//       transformPerspective: 1000,
//     });
//   };

//   const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
//     gsap.to(e.currentTarget, {
//       rotateX: 0,
//       rotateY: 0,
//       duration: 0.6,
//       ease: "power2.out",
//     });
//     setActiveIndex(null);
//   };

//   return (
//     <div
//       ref={galleryRef}
//       className="relative py-20 md:py-32 bg-[#0b0d0c] overflow-hidden"
//     >
//       {/* Section Header */}
//       <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-16">
//         <p className="text-xs tracking-[0.35em] uppercase text-white/50 mb-4">
//           Our Work
//         </p>
//         <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white">
//           Gallery
//         </h2>
//       </div>

//       {/* Image Grid */}
//       <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
//           {images.map((image, index) => (
//             <div
//               key={index}
//               className="gallery-item relative group cursor-pointer"
//               onMouseMove={(e) => handleMouseMove(e, index)}
//               onMouseEnter={() => setActiveIndex(index)}
//               onMouseLeave={handleMouseLeave}
//               style={{
//                 transformStyle: "preserve-3d",
//               }}
//             >
//               {/* Image Container */}
//               <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
//                 {/* Lens Overlay */}
//                 <div
//                   className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
//                   style={{
//                     background:
//                       activeIndex === index
//                         ? "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 70%)"
//                         : "none",
//                     opacity: activeIndex === index ? 1 : 0,
//                   }}
//                 />

//                 {/* Image */}
//                 <img
//                   src={image.src}
//                   alt={image.alt}
//                   className="gallery-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 />

//                 {/* Gradient Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//                 {/* Caption */}
//                 {image.caption && (
//                   <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
//                     <p className="text-white text-sm font-light tracking-wide">
//                       {image.caption}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Glow Effect */}
//               <div
//                 className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }