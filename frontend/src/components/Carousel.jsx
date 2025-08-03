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
    <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-lg">
      <Swiper
        className="h-[40vh] md:h-[50vh] !overflow-hidden"
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((src, i) => (
          <SwiperSlide key={i} className="!h-auto">
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
