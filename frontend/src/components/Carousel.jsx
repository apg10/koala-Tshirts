// src/components/Carousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Carousel({ slides }) {
  return (
    <div className="max-w-5xl mx-auto">
      <Swiper
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="rounded-2xl overflow-hidden shadow"
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i}>
            {/* alturas SOLO de la lista oficial de Tailwind 2 */}
            <div className="relative h-56 sm:h-72 md:h-96 lg:h-112 bg-gray-200">
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
