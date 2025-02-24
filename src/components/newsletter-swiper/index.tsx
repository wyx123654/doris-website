import { Pagination } from 'swiper';
import React, { useCallback, useRef, useState } from 'react';
import usePhone from '../../hooks/use-phone';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { NEWSLETTER_DATA } from '../../constant/newsletter.data';
import ReadMore from '../../components/ReadMore';
import { useAnimationFrame } from '../../hooks/use-animation-frame';
import './index.scss';

export function NewsLetterSwiper() {
    const { isPhone } = usePhone();

    const [swiperRef, setSwiperRef] = useState<SwiperClass>();
    const [progressCount, setProgressCount] = useState<number>(0);
    const [stop, setStop] = useState<boolean>(false);

    // Using ref to track progress internally
    const progressRef = useRef(progressCount);

    const handlePrevious = useCallback(() => {
        swiperRef?.slidePrev();
    }, [swiperRef]);

    const handleNext = useCallback(() => {
        swiperRef?.slideNext();
    }, [swiperRef]);

    useAnimationFrame(deltaTime => {
        if (!stop) {
            const newProgress = progressRef.current + deltaTime * 0.02;
            if (newProgress >= 100) {
                setProgressCount(0); // Reset state after reaching 100%
                progressRef.current = 0;
                setTimeout(handleNext, 0); // Delay to avoid direct state change within render
            } else {
                progressRef.current = newProgress;
                setProgressCount(newProgress); // Update UI state
            }
        }
    }, stop);

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
    };

    return (
        <div className="container pt-14" onMouseMove={() => setStop(true)} onMouseLeave={() => setStop(false)}>
            <div style={{ position: 'relative', '--progress-count': `${progressCount}%` } as any}>
                {!isPhone && (
                    <div
                        onClick={handlePrevious}
                        className="swiper-button-prev invisible group-hover:visible"
                        style={{ position: 'absolute', top: 'calc(50% - 2rem)', left: '-3rem', zIndex: 99 }}
                    ></div>
                )}

                <Swiper
                    pagination={pagination}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation={false}
                    modules={[Pagination]}
                    loop={true}
                    className="firstPageSwiper"
                    // style={{ minHeight: 480 }}
                    onSlideChange={() => {
                        progressRef.current = 0;
                        setProgressCount(0);
                    }}
                    onSwiper={setSwiperRef}
                >
                    {NEWSLETTER_DATA.map((newsletter, index) => {
                        return (
                            <SwiperSlide key={`${newsletter.title}-${index}`}>
                                <div className=" row flex justify-center xl:justify-start flex-start pb-8 lg:pb-16">
                                    <div className="w-full lg:w-auto flex justify-center ml-4">
                                        <img
                                            width={424}
                                            src={`${require(`@site/static/images/${newsletter.image}`).default}`}
                                            alt={newsletter.title}
                                        />
                                    </div>
                                    <div className="lg:w-[48rem] px-6 lg:px-0 lg:ml-12 mt-4 lg:mt-0 flex flex-col ">
                                        <div className="flex gap-1 mb-1">
                                            {newsletter.tags.map((value, idx) => (
                                                <div
                                                    key={'tag-' + idx}
                                                    className="color-[#4c576c] font-medium text-xs leading-5"
                                                >
                                                    {value}
                                                </div>
                                            ))}
                                        </div>
                                        <h3 className="leading-[38px] text-2xl font-semibold line-clamp-1	">
                                            {newsletter.title}
                                        </h3>
                                        <p className="pt-3 line-clamp-2 text-lg leading-8">{newsletter.content}</p>
                                        <ReadMore to={newsletter.to} className="pt-6" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                {!isPhone && (
                    <div
                        onClick={handleNext}
                        className="swiper-button-next invisible  group-hover:visible"
                        style={{ position: 'absolute', top: 'calc(50% - 2rem)', right: '-3rem', zIndex: 99 }}
                    ></div>
                )}
            </div>
        </div>
    );
}
