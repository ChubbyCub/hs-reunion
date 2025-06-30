'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import galleryData from '../../../gallery.json';

interface ImageData {
  src: string;
  width: number;
  height: number;
  tags?: string[];
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState('');

  // Filter images by search
  const filteredImages = search.trim() === ''
    ? galleryData
    : galleryData.filter(img =>
        Array.isArray(img.tags) &&
        img.tags.some(tag => tag.toLowerCase().includes(search.trim().toLowerCase()))
      );

  const openLightbox = (image: ImageData, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryData.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryData[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? galleryData.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryData[prevIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen bg-blue-500">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-title mb-4 text-foreground">
            Thư viện ảnh
          </h1>
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên lớp..."
              className="w-full max-w-5xl px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-base"
            />
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Image
                  src={image.src}
                  alt={`Gallery image ${index + 1}`}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-2 mb-2">
                      <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    {Array.isArray(image.tags) && image.tags.length > 0 && (
                      <div className="mt-1 px-3 py-1 rounded-full bg-blue-600 bg-opacity-90 text-white text-sm font-semibold shadow">
                        {image.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Drive Link at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="https://drive.google.com/drive/folders/1JqD9ZPK5n65qLrgVlTFaf6fcpJi-L-Ln?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl font-subtitle"
          >
            <ExternalLink size={20} />
              Xem thêm hình ảnh tại Google Drive
          </a>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <div className="relative max-w-7xl max-h-full">
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <X size={32} />
                </button>

                {/* Navigation buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <ChevronRight size={40} />
                </button>

                {/* Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage.src}
                    alt={`Gallery image ${currentIndex + 1}`}
                    width={selectedImage.width}
                    height={selectedImage.height}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    quality={95}
                    priority
                  />
                </motion.div>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium">
                  {currentIndex + 1} / {galleryData.length}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 